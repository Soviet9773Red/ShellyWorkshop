// =====================================================
// Shelly diagnostic script (no UI, no gzip)
// API: se.elpris.eu
// Purpose:
//  - verify endpoint stability
//  - verify avg24 and raw15 API parsing
//  - expose GetStatus / GetConfig via endpoint
// V1.0.4
// =====================================================
/* Patch
Fixed: diagnostic endpoint URLs were hardcoded to /script/1.
Now using Shelly.getCurrentScriptId() to generate correct endpoint URL
regardless of script slot.
*/

// ---------- memory tracer ----------
function tms(line) {
  let id = Shelly.getCurrentScriptId();
  Shelly.call(
    "HTTP.GET",
    { url: "http://localhost/rpc/Shelly.GetStatus" },
    function (resp) {
      if (!resp || !resp.body) return;

      let data;
      try {
        data = JSON.parse(resp.body);
      } catch (e) {
        return;
      }

      let key = "script:" + id;
      if (!(key in data)) return;

      let s = data[key];
      let total = s.mem_used + s.mem_free;
      let freeAtPeak = total - s.mem_peak;
      let percent = Math.round((100 * freeAtPeak) / total);

      print(
        "line" + line +
        " freeAtPeak=" + freeAtPeak +
        ", peak=" + s.mem_peak +
        ", " + percent + "% free, freeNow=" + s.mem_free
      );
    }
  );
}


// ---------- API URLs ----------
let API_URL_AVG24 =
  "https://se.elpris.eu/api/v1/prices/2025/12-16_SE3.json?avg24";

let API_URL_RAW15 =
  "https://se.elpris.eu/api/v1/prices/2025/12-16_SE3.json";


// ---------- storage ----------
let dataAvg24 = null;
let dataRaw15 = null;
let rpcStatus = null;
let rpcConfig = null;


// ---------- helpers ----------
function fetchJSON(url, cb) {
  Shelly.call("HTTP.GET", { url: url, timeout: 10 }, function (r, err) {
    if (err || !r || r.code !== 200 || !r.body) {
      cb(null, "HTTP error: " + (err || r.code));
      return;
    }
    try {
      cb(JSON.parse(r.body), null);
    } catch (e) {
      cb(null, "JSON parse error: " + e);
    }
  });
}

function fetchLocalRPC(method, cb) {
  Shelly.call(
    "HTTP.GET",
    { url: "http://localhost/rpc/" + method, timeout: 5 },
    function (r, err) {
      if (err || !r || r.code !== 200 || !r.body) {
        cb(null, "RPC error: " + (err || r.code));
        return;
      }
      // keep as string to avoid extra allocations
      cb(r.body, null);
    }
  );
}

function printPriceData(obj) {
  if (!obj) return "No data loaded";

  let out = [];

  if (obj.src) out.push("src = " + obj.src);
  if (obj.t0)  out.push("t0 = " + obj.t0);
  if (obj.s)   out.push("s = " + obj.s);
  if (obj.u)   out.push("u = " + obj.u);
  if (obj.raw !== undefined) out.push("raw = " + obj.raw);

  if (obj.p && obj.p.length) {
    out.push("p = " + obj.p.join(","));
  } else {
    out.push("p = (missing)");
  }

  return out.join("\n");
}

function getScriptBaseUrl() {
  let ip = getDeviceIP();
  let id = Shelly.getCurrentScriptId();
  return "http://" + ip + "/script/" + id;
}

function getDeviceIP() {
  let w = Shelly.getComponentStatus("wifi");
  return (w && w.sta_ip) ? w.sta_ip : "device-ip";
}

let ip = getDeviceIP();
print("=== Shelly diagnostic mode ===");
print("HTPP endpoints link:");
print(getScriptBaseUrl());
print("Test links:");

// ---------- HTTP endpoint ----------
HTTPServer.registerEndpoint("", function (s, n) {
  try {
    let o = {};
    if (s.query) {
      let pairs = s.query.split("&");
      for (let i = 0; i < pairs.length; i++) {
        let kv = pairs[i].split("=");
        o[kv[0]] = kv[1];
      }
    }

    s = null;
    n.code = 200;
    n.headers = [["Content-Type", "text/plain"]];

    if (o.r === "prices") {
      let mode = o.mode || "avg24";
      if (mode === "raw15") {
        n.body = "Mode: raw15\n" + printPriceData(dataRaw15);
      } else {
        n.body = "Mode: avg24\n" + printPriceData(dataAvg24);
      }
    }
    else if (o.r === "getstatus") {
      n.headers = [["Content-Type", "application/json"]];
      n.body = rpcStatus || "{\"error\":\"no status captured\"}";
    }
    else if (o.r === "getconfig") {
      n.headers = [["Content-Type", "application/json"]];
      n.body = rpcConfig || "{\"error\":\"no config captured\"}";
    }
	else {
	  let base = getScriptBaseUrl();
	  n.headers = [["Content-Type", "text/html"]];
	  n.body =
		"<!DOCTYPE html>" +
		"<html><head><meta charset='utf-8'></head><body>" +

		"<h3>Shelly diagnostic endpoint</h3>" +

		"<p><a href='" + base + "/?r=prices&mode=avg24'>" +
		"Prices (avg24)</a></p>" +

		"<p><a href='" + base + "/?r=prices&mode=raw15'>" +
		"Prices (15 min)</a></p>" +

		"<p><a href='" + base + "/?r=getstatus'>" +
		"RPC status (Shelly.GetStatus)</a></p>" +

		"<p><a href='" + base + "/?r=getconfig'>" +
		"RPC config (Shelly.GetConfig)</a></p>" +

		"</body></html>";
	}

  } catch (e) {
    log("endpoint error: " + e);
    n.code = 500;
    n.body = "Internal error";
  }

  n.send();
});


// ---------- startup ----------
let ip = getDeviceIP();
Timer.set(50, false, function () {
  let ip = getDeviceIP();
  print("Shelly diagnostic mode");
});

// ---------- capture RPC ----------
Timer.set(300, false, function () {
  fetchLocalRPC("Shelly.GetStatus", function (body) {
    rpcStatus = body;
    print("RPC GetStatus captured");
  });
});

Timer.set(500, false, function () {
  fetchLocalRPC("Shelly.GetConfig", function (body) {
    rpcConfig = body;
    print("RPC GetConfig captured");
  });
});


// ---------- load APIs sequentially ----------
Timer.set(1200, false, function () {
  tms(110);

  fetchJSON(API_URL_AVG24, function (obj, err) {
    if (err) {
      print("AVG24 load failed:", err);
      return;
    }

    dataAvg24 = obj;
    print("Loaded avg24:", obj.p ? obj.p.length : "no p[]");
    tms(120);

    Timer.set(800, false, function () {
      tms(130);

      fetchJSON(API_URL_RAW15, function (obj2, err2) {
        if (err2) {
          print("RAW15 load failed:", err2);
          return;
        }

        dataRaw15 = obj2;
        print("Loaded raw15:", obj2.p ? obj2.p.length : "no p[]");
        tms(140);
      });
    });
  });
});

