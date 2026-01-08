/*
 * ES6compShellyTest v1.80
 * (c) 2025 Alexander Soviet9773Red | https://github.com/Soviet9773Red
 * Developed during Shelly Scripting Advanced – October 2025
 * MIT License
*/
// Shelly Compatibility Test + Auto Device Info + Endpoint URLs
// Safe v1.80 – adds Shelly.GetDeviceInfo() to show firmware and device id
// A bug with script number
const sInfo = {
  name: "Shelly JS Compatibility Matrix",
  ver: "1.80",
  build: "2025-11-04T13:58",
};

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
  }

  // Always run detectCode check (even after syntax error)
  if (detectCode && level !== "Full") {
    try {
      var detected = eval(detectCode);
      if (detected) level = "Declared";
    } catch (_) {}
  }

  results.push({ feature: label, status: status, error: error, level: level });
  report += label + ": " + status + " | ";
}


// === Compatibility Tests ===

// Basic syntax
testFeature("let x=1; const y=2;", "let/const");
testFeature("(function(){return 1;})()", "function()");
testFeature("eval('(x)=>x+1')", "Arrow =>");
testFeature("eval('`t${1+1}`')", "Template `${}`");

// Array methods
testFeature("[1,2,3].map(function(v){return v*2})", "Array.map()");
testFeature("[1,2,3].filter(function(v){return v>0})", "Array.filter()");
testFeature("[1,2,3].reduce(function(a,b){return a+b})", "Array.reduce()");
testFeature("[1,2,3].forEach(function(v){v})", "Array.forEach()");
testFeature("[1,2,3].includes(2)", "Array.includes()", "typeof Array.prototype.includes!=='undefined'");
testFeature("[1,2,3].find(function(v){return v==2})", "Array.find()", "typeof Array.prototype.find!=='undefined'");
testFeature("[1,2,3].every(function(v){return v>0})", "Array.every()");
testFeature("[1,2,3].some(function(v){return v>3})", "Array.some()");
testFeature("Array.from([1,2,3])", "Array.from()", "typeof Array.from!=='undefined'");
testFeature("Array.of(1,2,3)", "Array.of()", "typeof Array.of!=='undefined'");
testFeature("[1,2,3].fill(0)", "Array.fill()", "typeof Array.prototype.fill!=='undefined'");

// Object / JSON
testFeature("Object.assign({}, {a:1})", "Object.assign()");
testFeature("Object.keys({a:1})", "Object.keys()");
testFeature("Object.values({a:1})", "Object.values()", "typeof Object.values!=='undefined'");
testFeature("Object.entries({a:1})", "Object.entries()", "typeof Object.entries!=='undefined'");
testFeature("JSON.stringify({x:1})", "JSON.stringify()");
testFeature("JSON.parse('{\"x\":1}')", "JSON.parse()");

// Strings
testFeature("'abc'.startsWith('a')", "String.startsWith()", "typeof String.prototype.startsWith!=='undefined'");
testFeature("'abc'.endsWith('c')", "String.endsWith()", "typeof String.prototype.endsWith!=='undefined'");
testFeature("'abc'.includes('b')", "String.includes()", "typeof String.prototype.includes!=='undefined'");
testFeature("'a'.repeat(3)", "String.repeat()", "typeof String.prototype.repeat!=='undefined'");
testFeature("' a '.trim()", "String.trim()");

// Advanced syntax
testFeature("eval('class C{}')", "class syntax");
testFeature("eval('function* g(){}')", "generator");
testFeature("Promise.resolve(1)", "Promise", "typeof Promise!=='undefined'");
testFeature("Symbol('x')", "Symbol", "typeof Symbol!=='undefined'");
testFeature("eval('123n')", "BigInt", "typeof BigInt!=='undefined'");
testFeature("eval('const {a,b}=obj')", "Object destructuring");
testFeature("eval('const arr=[1,2,3];const arr2=[...arr]')", "Spread operator");
testFeature("eval('function f(a=1){return a;}')", "Default parameters");
testFeature("eval('function f(...a){return a.length;}')", "Rest parameters");
testFeature("eval('const o={a,b};')", "Enhanced object literal");
testFeature("try{throw 1;}catch(e){}finally{}", "try/catch/finally");

// --- Date API ---
testFeature("new Date().getFullYear()", "Date.getFullYear()", "typeof Date!=='undefined'");
testFeature("new Date().toISOString()", "Date.toISOString()", "Date.prototype.toISOString");

// --- Math API ---
testFeature("Math.trunc(3.5)", "Math.trunc()", "typeof Math.trunc!=='undefined'");
testFeature("Math.sign(-5)", "Math.sign()", "typeof Math.sign!=='undefined'");

// --- Number API ---
testFeature("Number.isNaN(NaN)", "Number.isNaN()", "typeof Number.isNaN!=='undefined'");
testFeature("Number.isInteger(3)", "Number.isInteger()", "typeof Number.isInteger!=='undefined'");

// --- Typed Arrays / ArrayBuffer (optional safe test) ---
testFeature("new Uint8Array(4)", "TypedArray", "typeof Uint8Array!=='undefined'");
testFeature("new ArrayBuffer(8)", "ArrayBuffer", "typeof ArrayBuffer!=='undefined'");

// Compute summary counts from results[]
var ok = 0, decl = 0, no = 0;
for (var i = 0; i < results.length; i++) {
  var r = results[i];
  var s = r.status || r.s;   // "OK" / "NO"
  var l = r.level  || r.l;   // "Full" / "Declared" / "Missing"
  if (s === "OK") ok++;
  else if (l === "Declared") decl++;
  else no++;
}
// --- Estimate ECMAScript compatibility level ---
var esLevel = "ECMAScript 3–5 (1999–2009)";
if (ok > results.length * 0.6) esLevel = "ECMAScript 5 + partial ES6 (2015)";
if (ok > results.length * 0.8) esLevel = "ECMAScript 6 (2015) level features";

// Safe, compact console line
//print("Shelly JS Compatibility Test Done: ",JSON.stringify({ tested: results.length, ok: ok, declared: decl, no: no }));
print(sInfo.name,sInfo.ver, "Done.", JSON.stringify({
  tested: results.length,
  ok: ok,
  declared: decl,
  no: no,
  level: esLevel
}));

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

// === Register endpoints (3-way split) to stay below 4 KB ===
function registerSplitJSON() {
  var info = getDeviceInfo();

  function makePart(start, end) {
    var part = [];
    for (var i = start; i < end && i < results.length; i++) {
      var r = results[i];
      part.push({ f: r.feature, s: r.status, l: r.level, e: r.error });
    }
    return part;
  }

  var total = results.length;
  var step = Math.ceil(total / 3);

  HTTPServer.registerEndpoint("es6a", function(req, res) {
    res.code = 200;
    res.headers = {"Content-Type": "application/json"};
    res.body = JSON.stringify({ t: total, p: "A", r: makePart(0, step) });
    res.send();
  });

  HTTPServer.registerEndpoint("es6b", function(req, res) {
    res.code = 200;
    res.headers = {"Content-Type": "application/json"};
    res.body = JSON.stringify({ t: total, p: "B", r: makePart(step, 2 * step) });
    res.send();
  });

  HTTPServer.registerEndpoint("es6c", function(req, res) {
    res.code = 200;
    res.headers = {"Content-Type": "application/json"};
    res.body = JSON.stringify({ t: total, p: "C", r: makePart(2 * step, total) });
    res.send();
  });

  var ip = getIP();
  if (ip) {
    print("Splitted JSON endpoints:");
    print(" Part A → http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/es6a");
    print(" Part B → http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/es6b");
    print(" Part C → http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/es6c");
  }
}


// === GZIP HTML+JS endpoint ===
// ← test.html → base64
let TEST_HTML_GZ = "H4sIAAAAAAAAA3VTyW7bMBC9+yumCgq0QBQvSINUlowWXa4t2l56pMmxxIYiBXLkOA3y75mRZDuXQJDI4XvzZqPKN19/fPnz9+c3aKh1m1kpCzjl6ypDn8kBKsNLi6RANyompCrraZffZsdjr1qssr3F+y5EykAHT+iZdm8NNZXBvdWYD8YlWG/JKpcnrRxWy6uFyCR6cLiZbYN5gEfYsX++U611DwV8jsy+hKR8yhNGu1tDq2JtfQGrRXdYw9OsWbET4YFy5WzNgOboGAUitXXI6DZEgzHXwTnVJWTKtDurqZ7CGoYsC/j44a0gh3yybxdTLCmBzEmxgGV3gBScNXChtV5Dp4yxvi7gmoEbcXqZmcMdjTIiofRdHUPvTQEXu2t5BLsKdwxygoHl64jo12NL7tHWDRUc2pmB6MOZGNG8RjOo3ZkYIk8XX+F+atFYBe9elH4jpb+HxxnA0E2uP0oP+G2Ow0r2P/d0uRp79DQr59NEy/l0f2S0G5Yojd2DdiqlKpN7oqzHmAnCWLMEa6qMLDnMNuy7nABxEmS8ShkM6lU2ji7fBqLQFksZkbgxe/Ibxz9obt0URY7jpqRmc1HO+Su776ioj3iyf2HqHZ3M330nN3u05+w9qs8H+cnohjCpbyWDbij1mEiZdLQdQYqaE8FEV/+SsMZjadLYHS54+AmfAY+8GReVAwAA"; 

// ← test.js → base64
let TEST_JS_GZ   = "H4sIAAAAAAAAA51WzW7bRhC+6ymmbACSlUPJTu3W1k+ROk6bNm4K2DfDsClyaK212jV2V1IEm0AuvQXooT0VDdDH6PP4BfoKnVlStoREadyTuDOz8/d9M6sCXTaMgpa5ylpHQ5RynnyH7hlORYYvVKGDuAGQuCGqyECvDya5tFpF8b1YkBVrrkkCkGllHeQ4hR6cP7pmZTLWOUq4uYFwokZKz1RYQlTrRO4VYRmfd5YcFDNYcjBFU1tBLSlmZ3TzGwijEJqwJGpCGIewx7a1w1xnkzEql1ygO5DIn9/OX+RRmPsiwzgRSqH5/vjwJfT8DYDz7qBf9WCv2xr0KSoZl92B6ZPiuTDjWWruVMWsClX6nmQpNzSK71vyiQkc42tHNQdVXF8TKO0gnaZCpgOJSVBF6TQaooDIza9QF2AZJfis1+Pu5lgIhXkY+9BrAzvhJMd1FHJfK0eKunTquHeYqHSMJUwXR0LAY1adBhMhc49YCSgt/t9oQcU4+OEI9vX4KnViIKRwczhMnRGvwaF1VHTZaDR+NnosLCaplNEJXS48b8OWzYy4cq3tFtqdlIMsMZUDElM31pgPHmaefdi8cRo3Kvl0AXmrBY8fP4b9IWYjKLQBPXFnujgb41ibOevIiCGcJpdaqCj0FMjkJEcbBSvGQRz/F4vsZLyOw2DdXGIvyLTUZu9z/OrL7EnWCWpqg0kVpwbEojq12VBIhAskXwSGuiBkXv3ENK9nyaCbGOVpSJgshpUwIeKyaXKVGovR9KR9GifGX0nIhmYiWlFvsnpj9coWy+LOnVc3YK/rWTWQobeWSBWMeu0N2jqZ5F+le+0Op8e9j1gvSACiS4kmEtWFG9Kp2YxXdhbBypWciNOqVgbIJLbX64WvfqSJ0qNms9J4yldqyepnFJf2AY8dp7BipjQfl8JQoy8FharvPp9IGfIiu/3zF95b7/n0uj/++ufvX/1au333tip74S+T9gPe9GitM07Ru1J61ZPRM965XUdbzuV92rTNzbLbos/qaJLi7khhU2t7waNril8GpPV18X6mnn3EjDKqtS2KU9OKsCQCWzTuaX6ZZoQxMzkKB0gIIqo83ODs4pp4Dx4GXufHyCWinUhn/eK+ffM7HGuXyj1K+p4ZJdwAYUEyPSqBG8oCD4B/BjJZwqKfrHn3lsRKl3AorKWROfdoM+nQvsQpMomDg/3Dp0d+l8CT2ze/bUO0ubu7S19b7fZu7Pc680mPoA/3qcAX0E524jWOtumto9lxIpVwcLQD0VZ7c/vjvr5e52txm/JmZYEpzTnaoPNJzX4PON/0ZfQWKPj3k7a9z2HxftYpledkRRDTM1o/omjMYqUyQzU9gVJfREGNxoExNN9SpzlvKm4BvxeQpy7dCzaAbnvCPJwr69bmakBeXj4Yl8GlUSXG8F8BfqL/BQU/S0JYCQAA"; 

function serveGzip(name, data, type) {
  HTTPServer.registerEndpoint(name, function (req, res) {
    try {
      res.code = 200;
      res.headers = {
        "Content-Type": type,
        "Content-Encoding": "gzip"
      };
      res.body = atob(data); // decode Base64 → binary gzip
    } catch (e) {
      res.code = 500;
      res.body = "Internal error: " + e;
    }
    res.send();
  });
}

// Main GZIP UI endpoints
serveGzip("test", TEST_HTML_GZ, "text/html");
serveGzip("test.js", TEST_JS_GZ, "application/javascript");



  // Print URLs
  var ip = getIP();
  var dinfo = getDeviceInfo();
  if (ip) {
    print("HTML -> http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/test");
  } else {
    print("Could not detect IP automatically.");
  }

// Wait for RPC to complete, then register endpoints safely
Timer.set(1500, false, function () {
  if (deviceInfo.model && deviceInfo.id) {
    registerSplitJSON();
  } else {
    // Try again in 1s if RPC not done yet
    Timer.set(1000, false, registerSplitJSON);
  }
});




