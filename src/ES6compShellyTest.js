// Shelly Compatibility Test + Auto Device Info + Endpoint URLs
// Safe v1.83 – adds Shelly.GetDeviceInfo() to show firmware and device id

const sInfo = {
  name: "Shelly Scripting (MJS) vs JavaScript Features",
  ver: "1.83",
  build: "2026-01-02T11:59",
};

const runtime = {
  scriptId: Shelly.getCurrentScriptId(),
  ip: "",
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


// === Compatibility Tests v 1.84 ===

//1. Basic syntax
testFeature("let x=1; const y=2;", "let/const");
testFeature("(function(){return 1;})()", "function()");
testFeature("eval('(x)=>x+1')", "Arrow =>");
testFeature("eval('`t${1+1}`')", "Template `${}`");

//2. Array methods
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
testFeature("Array.isArray([])", "Array.isArray()");
/* // not working in this ver. 
testFeature("[1,2,3].indexOf(2)", "Array.indexOf()");
testFeature("[1,2,3].join('-')", "Array.join()");
testFeature("[1,2,3].slice(1)", "Array.slice()");
testFeature("[1,2,3].concat([4])", "Array.concat()");
*/

//3. Object / JSON
testFeature("Object.assign({}, {a:1})", "Object.assign()");
testFeature("Object.keys({a:1})", "Object.keys()");
testFeature("Object.values({a:1})", "Object.values()", "typeof Object.values!=='undefined'");
testFeature("Object.entries({a:1})", "Object.entries()", "typeof Object.entries!=='undefined'");
testFeature("JSON.stringify({x:1})", "JSON.stringify()");
testFeature("JSON.parse('{\"x\":1}')", "JSON.parse()");
testFeature("Object.create(null)", "Object.create(null)");
/* // not working in this ver. 
testFeature("Object.freeze({a:1}).a", "Object.freeze()");
testFeature("Object.seal({a:1}).a", "Object.seal()");
testFeature("({a:1}).hasOwnProperty('a')", "hasOwnProperty()");
*/
//4. Strings
testFeature("'abc'.startsWith('a')", "String.startsWith()", "typeof String.prototype.startsWith!=='undefined'");
testFeature("'abc'.endsWith('c')", "String.endsWith()", "typeof String.prototype.endsWith!=='undefined'");
testFeature("'abc'.includes('b')", "String.includes()", "typeof String.prototype.includes!=='undefined'");
testFeature("'a'.repeat(3)", "String.repeat()", "typeof String.prototype.repeat!=='undefined'");
testFeature("' a '.trim()", "String.trim()");
testFeature("'x'.padStart(3,'0')", "String.padStart()");
testFeature("'x'.padEnd(3,'0')", "String.padEnd()");
/* // not working in this ver. 
testFeature("'abc'.charAt(1)", "String.charAt()");
testFeature("'abc'.charCodeAt(1)", "String.charCodeAt()");
testFeature("'abc'.toUpperCase()", "String.toUpperCase()");
testFeature("'ABC'.toLowerCase()", "String.toLowerCase()");
*/
//5. Advanced syntax
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

//6. --- Date API ---
testFeature("new Date().getFullYear()", "Date.getFullYear()", "typeof Date!=='undefined'");
testFeature("new Date().toISOString()", "Date.toISOString()", "Date.prototype.toISOString");
testFeature("Date.now()", "Date.now()");
/* // not working in this ver. 
testFeature("(new Date()).getTime()", "Date.getTime()");
testFeature("(new Date(0)).toUTCString()", "Date.toUTCString()");
*/
//7. --- Math API ---
testFeature("Math.trunc(3.5)", "Math.trunc()", "typeof Math.trunc!=='undefined'");
testFeature("Math.sign(-5)", "Math.sign()", "typeof Math.sign!=='undefined'");
testFeature("Math.round(1.4)", "Math.round()");
/* // not working in this ver. 
testFeature("Math.max(1,2,3)", "Math.max()");
testFeature("Math.min(1,2,3)", "Math.min()");
testFeature("Math.abs(-5)", "Math.abs()");
*/
//8. --- Number API ---
testFeature("Number.isNaN(NaN)", "Number.isNaN()", "typeof Number.isNaN!=='undefined'");
testFeature("Number.isInteger(3)", "Number.isInteger()", "typeof Number.isInteger!=='undefined'");
/* // not working in this ver. 
testFeature("Number.parseInt('10',10)", "Number.parseInt()");
testFeature("Number.parseFloat('1.5')", "Number.parseFloat()");
*/
//testFeature("try{throw new Error('x')}catch(e){e.message}", "throw Error()"); // unsafe – not executed

//9. --- Typed Arrays / ArrayBuffer (optional safe test) ---
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
		var err = r.error || "";
		if (err.length > 60) err = err.substring(0, 57) + "...";
		part.push({ f: r.feature, s: r.status, l: r.level, e: err });
	  }
	  return part;
	}

  var total = results.length;
  var step = Math.ceil(total / 3);

  HTTPServer.registerEndpoint("es6a", function(req, res) {
    res.code = 200;
    res.headers = {"Content-Type": "application/json"};
    res.body = JSON.stringify({info: sInfo, t: total, p: "A", r: makePart(0, step) });
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
  if (ip) runtime.ip = ip;
  if (ip) {
    print("Splitted JSON endpoints:");
    print(" Part A → http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/es6a");
    print(" Part B → http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/es6b");
    print(" Part C → http://" + ip + "/script/" + Shelly.getCurrentScriptId() + "/es6c");
  }
}


// === GZIP HTML+JS endpoint ===
// ← test.html → base64
let TEST_HTML_GZ = ""; 

// ← test.js → base64
let TEST_JS_GZ   = ""; 

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
	
// Safe, compact console line
print(sInfo.name,sInfo.ver, "Done.", JSON.stringify({
  tested: results.length,
  ok: ok,
  declared: decl,
  no: no,
  level: esLevel
}));
	
  } else {
    // Try again in 1s if RPC not done yet
    Timer.set(1000, false, registerSplitJSON);
  }
});