// Shelly Compatibility Test + Auto Device Info + Endpoint URLs
// Safe v1.7 – adds Shelly.GetDeviceInfo() to show firmware and device id

let results = [];
let report = "";

// --- Safe tester ---
function testFeature(code, label, detectCode) {
  var status = "NO";
  var error = "";
  var level = "Missing";
  try {
    eval(code);
    status = "OK";
    level = "Full";
  } catch (e) {
    error = String(e);
    if (detectCode) {
      try {
        var detected = eval(detectCode);
        if (detected) level = "Declared";
      } catch (_) { level = "Missing"; }
    }
  }
  results.push({ feature: label, status: status, error: error, level: level });
  report += label + ": " + status + " | ";
}

// === BASIC SYNTAX ===
testFeature("let x=1; const y=2;", "let/const");
testFeature("(function(){return 1;})()", "function()");
testFeature("eval('(x)=>x+1')", "Arrow =>");
testFeature("eval('`t${1+1}`')", "Template `${}`");

// === ARRAY METHODS ===
testFeature("[1,2,3].map(function(v){return v*2})", "Array.map()");
testFeature("[1,2,3].filter(function(v){return v>0})", "Array.filter()");
testFeature("[1,2,3].reduce(function(a,b){return a+b})", "Array.reduce()");
testFeature("[1,2,3].forEach(function(v){v})", "Array.forEach()");
testFeature("[1,2,3].includes(2)", "Array.includes()");
testFeature("[1,2,3].find(function(v){return v==2})", "Array.find()");
testFeature("[1,2,3].every(function(v){return v>0})", "Array.every()");
testFeature("[1,2,3].some(function(v){return v>3})", "Array.some()");

// === OBJECT / JSON ===
testFeature("Object.assign({}, {a:1})", "Object.assign()");
testFeature("Object.keys({a:1})", "Object.keys()");
testFeature("Object.values({a:1})", "Object.values()");
testFeature("Object.entries({a:1})", "Object.entries()");
testFeature("JSON.stringify({x:1})", "JSON.stringify()");

// === ADVANCED SYNTAX ===
testFeature("eval('class C{}')", "class syntax");
testFeature("eval('function* g(){}')", "generator");
testFeature("Promise.resolve(1)", "Promise", "typeof Promise!=='undefined'");
testFeature("Symbol('x')", "Symbol", "typeof Symbol!=='undefined'");
testFeature("eval('123n')", "BigInt");

print("Shelly JS Compatibility Test Done.");
print("Compact:", report);

// === Device info (async-safe for Gen3 Shelly) ===
var deviceInfo = { id:"", model:"", fw:"", ver:"", app:"", mac:"" };

Shelly.call("Shelly.GetDeviceInfo", {}, function(result, error_code, error_msg) {
  if (error_code === 0 && result) {
    deviceInfo.id = result.id || "";
    deviceInfo.model = result.model || "";
    deviceInfo.fw = result.fw_id || "";
    deviceInfo.ver = result.ver || "";
    deviceInfo.app = result.app || "";
    deviceInfo.mac = result.mac || "";
    print("Device info loaded:", deviceInfo.model, deviceInfo.id);
  } else {
    print("⚠️ Unable to load device info via RPC:", error_msg || error_code);
  }
});

// Helper returns latest cached info
function getDeviceInfo() {
  return deviceInfo;
}

// === Detect IP ===
function getIP() {
  var ip = "";
  try { var eth = Shelly.getComponentStatus("eth"); if (eth && eth.ip) ip = eth.ip; } catch (e) {}
  if (!ip) {
    try { var wifi = Shelly.getComponentStatus("wifi"); if (wifi && wifi.sta_ip) ip = wifi.sta_ip; } catch (e) {}
  }
  return ip;
}

// === Register endpoints only after we have device info ===

// === JSON endpoint ===
function registerEndpoints() {
  HTTPServer.registerEndpoint("es6", function(req, res) {
    var info = getDeviceInfo();
    res.code = 200;
    res.headers = {"Content-Type": "application/json"};
    res.body = JSON.stringify({
      device_id: info.id,
      model: info.model,
      firmware: info.fw,
      version: info.ver,
      total: results.length,
      results: results
    });
    res.send();
  });

// === HTML endpoint ===
HTTPServer.registerEndpoint("es6html", function(req, res) {
    var info = getDeviceInfo();
    var okCount = 0, failCount = 0;
    for (var i = 0; i < results.length; i++) {
      if (results[i].status === "OK") okCount++;
      else failCount++;
    }

    var html = "<html><head><meta charset='utf-8'><title>Shelly JS Compatibility</title>";
    html += "<style>body{font-family:sans-serif;background:#fafafa;padding:10px;}";
    html += "table{border-collapse:collapse;width:100%;font-size:14px}";
    html += "th,td{border:1px solid #ccc;padding:4px;text-align:left;}";
    html += ".ok{color:green;font-weight:bold}.no{color:red;font-weight:bold}.decl{color:orange;font-weight:bold}";
    html += "h1{font-size:18px;margin-top:0}</style></head><body>";

    html += "<h1>🧩 Shelly JavaScript Compatibility Matrix</h1>";
    html += "<p><b>Firmware:</b> " + (info.ver || "-") +
            " (" + (info.fw || "-") + ") | <b>Device:</b> " +
            (info.model || "-") + " (" + (info.id || info.mac || "-") + ")</p>";
    html += "<table><tr><th>#</th><th>Feature / API</th><th>Result</th><th>Support</th><th>Notes</th></tr>";

    for (var j = 0; j < results.length; j++) {
      var r = results[j];
      var cls = (r.status === "OK") ? "ok" : (r.level === "Declared" ? "decl" : "no");
      var note = "";
      if (r.status === "OK") note = "Works correctly";
      else if (r.level === "Declared") note = "Declared but not implemented";
      else note = (r.error || "Not supported").split(":")[0];
      html += "<tr><td>" + (j + 1) + "</td><td>" + r.feature + "</td><td class='" + cls + "'>" + r.status + "</td><td class='" + cls + "'>" + r.level + "</td><td>" + note + "</td></tr>";
    }

    html += "</table><p><b>Total:</b> " + results.length + " | ✅ " + okCount + " OK, ❌ " + failCount + " NO</p>";
    html += "<h3>📘 Summary</h3><p>Compatibility ≈ ECMAScript 5 (2009) + partial ES6 (2015).<br>";
    html += "Full support: map, filter, every, some, forEach, Object.assign, JSON.stringify.<br>";
    html += "Declared only: Promise, Symbol.<br>";
    html += "Missing: arrow functions, classes, template strings, reduce, find*, includes*, BigInt, etc.</p>";
    html += "</body></html>";

    res.code = 200;
    res.headers = {"Content-Type": "text/html"};
    res.body = html;
    res.send();
  });

  // print URLs when endpoints are ready
  var ip = getIP();
  var info = getDeviceInfo();
  if (ip) {
    print("Device:", info.model || "unknown", info.id ? "(" + info.id + ")" : "");
    print("Firmware:", info.ver || "", info.fw ? "(" + info.fw + ")" : "");
    print("Endpoints:");
    print(" JSON → http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/es6");
    print(" HTML → http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/es6html");
  } else {
    print("Could not detect IP automatically.");
  }
}

// Wait for RPC to complete, then register endpoints
Timer.set(1000, false, registerEndpoints);

