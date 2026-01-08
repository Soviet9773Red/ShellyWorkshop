/*
 * ES6compShellyTest v1.71
 * (c) 2025 Alexander Soviet9773Red | https://github.com/Soviet9773Red
 * Developed during Shelly Scripting Advanced – October 2025
 * MIT License
*/
// Shelly Compatibility Test + Auto Device Info + Endpoint URLs
// Safe v1.71 – adds Shelly.GetDeviceInfo() to show firmware and device id

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
/*
// === Additional ES6 Syntax and Safe Methods (based on Denis' V2) ===
// --- Syntax extensions ---
testFeature("let {a,b} = {a:1,b:2}", "Object destructuring");
testFeature("[...[1,2,3]]", "Spread operator");
testFeature("function f(x=5){return x}", "Default parameters");
testFeature("function f(...args){return args.length}", "Rest parameters");
testFeature("let x=1; ({x})", "Enhanced object literal");

// --- Array additions ---
testFeature("Array.from([1,2,3])", "Array.from()");
testFeature("Array.of(1,2,3)", "Array.of()");
testFeature("[1,2,3].fill(0)", "Array.fill()");

// --- String methods ---
testFeature("'abc'.startsWith('a')", "String.startsWith()");
testFeature("'abc'.endsWith('c')", "String.endsWith()");
testFeature("'abc'.includes('b')", "String.includes()");
testFeature("'a'.repeat(3)", "String.repeat()");
testFeature("' a '.trim()", "String.trim()");
*/
// --- Other safe tests ---
testFeature("try {throw 'x'} catch(e){} finally{}", "try/catch/finally");
testFeature("JSON.parse('{\"x\":1}')", "JSON.parse()");


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

    html += "<h1>🧩 Shelly JS Compatibility Matrix</h1>";
    html += "<p><b>Fw:</b> " + (info.ver || "-") +
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


html += "</table><p><b>Total:</b> " + results.length +
        " | ✅ " + okCount + " OK, ❌ " + failCount + " NO</p>";

// --- Dynamic summary based on real results ---
var okList = [], declList = [], noList = [];
for (var k = 0; k < results.length; k++) {
  var rr = results[k];
  if (rr.status === "OK") okList.push(rr.feature);
  else if (rr.level === "Declared") declList.push(rr.feature);
  else noList.push(rr.feature);
}

// Try to guess ES level by ratio
var esLevel = "ECMAScript 5 (2009)";
if (okCount > results.length * 0.6) esLevel = "ECMAScript 5 + partial ES6 (2015)";
if (okCount > results.length * 0.8) esLevel = "ECMAScript 6 (2015) level features";

html += "<h3>📘 Summary</h3>";
html += "<p>Detected compatibility ≈ " + esLevel + ".<br>";
if (okList.length)
  html += "<b>Full support:</b> " + okList.slice(0, 7).join(", ") + (okList.length > 7 ? ", ..." : "") + ".<br>";
if (declList.length)
  html += "<b>Declared only:</b> " + declList.join(", ") + ".<br>";
if (noList.length)
  html += "<b>Missing:</b> " + noList.slice(0, 8).join(", ") + (noList.length > 8 ? ", ..." : "") + ".";
html += "</p>";

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



