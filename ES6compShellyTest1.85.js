/*
 * ES6compShellyTest v1.85
 * (c) 2025 Alexander Soviet9773Red | https://github.com/Soviet9773Red
 * Developed during Shelly Scripting Advanced – October 2025
 * Shelly Compatibility Test + Device Info + Endpoint URLs
 * MIT License
*/

const sInfo = {
  name: "Shelly Scripting vs JS Features test v.",
  v: "1.85",
  d: "2026-01-05T13:44",
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
  var error = 0;   // 0 = OK
  try {
    eval(code);
    status = "OK";
    level = "Full";
  } catch (e) {
	  if (e instanceof SyntaxError) error = 1;
	  else if (e instanceof ReferenceError) error = 2;
	  else if (e instanceof TypeError) error = 3;
	  else error = 9;
	}
// 0 = OK, 1 = SyntaxError, 2 = ReferenceError, 3 = TypeError, 9 = Other

  // Always run detectCode check (even after syntax error)
  if (detectCode && level !== "Full") {
    try {
      var detected = eval(detectCode);
      if (detected) level = "Declared";
    } catch (_) {}
  }

	  results.push({f: label, s: status, // "OK" | "NO"
	  sup: error   // 0 | 1 | 2 | 3 | 9
	});
	
  report += label + ": " + status + " | ";
}


// === Compatibility Tests v 1.85 ===

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
testFeature("[1,2,3].indexOf(2)", "Array.indexOf()");
testFeature("[1,2,3].join('-')", "Array.join()");
testFeature("[1,2,3].slice(1)", "Array.slice()");
testFeature("[1,2,3].concat([4])", "Array.concat()");

//3. Object / JSON
testFeature("Object.assign({}, {a:1})", "Object.assign()");
testFeature("Object.keys({a:1})", "Object.keys()");
testFeature("Object.values({a:1})", "Object.values()", "typeof Object.values!=='undefined'");
testFeature("Object.entries({a:1})", "Object.entries()", "typeof Object.entries!=='undefined'");
testFeature("JSON.stringify({x:1})", "JSON.stringify()");
testFeature("JSON.parse('{\"x\":1}')", "JSON.parse()");
testFeature("Object.create(null)", "Object.create(null)");
testFeature("Object.freeze({a:1}).a", "Object.freeze()");
testFeature("Object.seal({a:1}).a", "Object.seal()");
testFeature("({a:1}).hasOwnProperty('a')", "hasOwnProperty()");

//4. Strings
testFeature("'abc'.startsWith('a')", "String.startsWith()", "typeof String.prototype.startsWith!=='undefined'");
testFeature("'abc'.endsWith('c')", "String.endsWith()", "typeof String.prototype.endsWith!=='undefined'");
testFeature("'abc'.includes('b')", "String.includes()", "typeof String.prototype.includes!=='undefined'");
testFeature("'a'.repeat(3)", "String.repeat()", "typeof String.prototype.repeat!=='undefined'");
testFeature("' a '.trim()", "String.trim()");
testFeature("'x'.padStart(3,'0')", "String.padStart()");
testFeature("'x'.padEnd(3,'0')", "String.padEnd()");
testFeature("'abc'.charAt(1)", "String.charAt()");
testFeature("'abc'.charCodeAt(1)", "String.charCodeAt()");
testFeature("'abc'.toUpperCase()", "String.toUpperCase()");
testFeature("'ABC'.toLowerCase()", "String.toLowerCase()");
testFeature("'abc'.toString()", "String.toString()");

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
testFeature("(new Date()).getTime()", "Date.getTime()");
testFeature("(new Date(0)).toUTCString()", "Date.toUTCString()");

//7. --- Math API ---
testFeature("Math.trunc(3.5)", "Math.trunc()", "typeof Math.trunc!=='undefined'");
testFeature("Math.sign(-5)", "Math.sign()", "typeof Math.sign!=='undefined'");
testFeature("Math.round(1.4)", "Math.round()");
testFeature("Math.max(1,2,3)", "Math.max()");
testFeature("Math.min(1,2,3)", "Math.min()");
testFeature("Math.abs(-5)", "Math.abs()");

//8. --- Number API ---
testFeature("Number.isNaN(NaN)", "Number.isNaN()", "typeof Number.isNaN!=='undefined'");
testFeature("Number.isInteger(3)", "Number.isInteger()", "typeof Number.isInteger!=='undefined'");
testFeature("Number.parseInt('10',10)", "Number.parseInt()");
testFeature("Number.parseFloat('1.5')", "Number.parseFloat()");

//9. --- Typed Arrays / ArrayBuffer (optional safe test) ---
testFeature("new Uint8Array(4)", "TypedArray", "typeof Uint8Array!=='undefined'");
testFeature("new ArrayBuffer(8)", "ArrayBuffer", "typeof ArrayBuffer!=='undefined'");

//10. --- Runtime hazards (not part of compatibility score), unsafe
testFeature("try{throw new Error('x')}catch(e){e.message}", "Err. obj. allocation ☠");


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
var esL = "ECMAScript 3-5, 1999–2009";
if (ok > results.length * 0.6) esL = "ECMAScript 5 + partial ES6, 2015";
if (ok > results.length * 0.8) esL = "ECMAScript 6 (2015) level features";

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
			part.push({
			  f: r.f,
			  s: r.s,
			  sup: r.sup
			});
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
let TEST_HTML_GZ = "H4sIAAAAAAAAA2VSWY/TMBD+K0MqJJCapmUPLc4hEMcrCHjh0bEniVnHjuxJD6r+d2ynuzysolhzfPPNWb36/O3Tr9/fv8BAo26q+ILmpq8zNFnQkcumGpE4iIE7j1RnM3X5Q3a1Gj5ine0VHibrKANhDaEJqIOSNNQS90pgnpQ1KKNIcZ17wTXWu802sHg6aWxaK0/nLsTmHR+VPjH46AJyDZ4bn3t0qith5K5Xhu3upmN5Id5qPLfWSXS5sFrzySODJ+kZDXwmW0KqgL2/ex0dx6Ug9rDdJqphTfJKxWA3HcFbrSSshBAlTFxKZXoGt8FxH/BAeKSca9UbprGjSHBuuXjsnZ2NZLDqbuNXXjb28RwKso71DtGUkDo8oOoHYq3VMkCMvUIcyvKFHy4biUJfIdaFzeBL1OXDiFJxePO/NbiPvb09pzGtyYUO16HMFOrVX2S7d7H1S1UsC6iKZdVxEU0l1R6E5t7XmYhXcANK1hllEXazuKMhbDeDFF9ny7jz1hLZke3iYCM8QJsqFbFQtDpYyYV/aFZVEd4ofUVOs8Nn/Qf6WdOz+nOe4nUtehGji0TZVFNi9fMYc01P+bxwaiLwToSM6Gnzx0f/Yg7C0mSRTv4fUVYACgIDAAA="; 

// ← test.js → base64
let TEST_JS_GZ   = "H4sIAAAAAAAAA41VzW7bOBB+FYINAmltyHbSpI1lyWhTt9vfLGrfjKDWzyhRTJMGRdkxbAG97K3AHnorWqCPsc+TF9hX2KFEO0njtD1x9M0MZ+YbzijJeaRSwUmWTweXysLDXkpQuSwhz/OaXfo8Z4y2q89Wl/YXXAWXPSmFXKN7XfoeEucWtt+lg8UUDEars0huBOxNxEW6PeTV17/R5+rbp9sexyzIsu0eYowOXKA9qOjcog05jRr9c2Bs4bwA9QxmaQQveSKo7ahz4Jb0fOlcZIJbtkFS1Hr+MhI8UySGmTfaWWrMmYgY2GpFcz7mYs5pQYwijRGlxcitfJL5xmVWKtZ2yfxDGnevxXbpFIsonwBXzhmoHgMtPl28jC2KsTHLlHOQfw7evvFGndCvCmh3GqGPt6JF0Qmlj4rn8zWYzItRYQ9pFCAD9NSybKzmd4IM4FJ5tIpAdJYk58EsSFkQMqCF7f4lxSTNwAkYs4aGYMgOg21c1q/14S/00Tb9qcFmm1aUfZkNm6eOlu6nTenrsJRjwRWCnrbe3S1Z58EEuhupVrWoRuuEVjJ2pB/JdKrulm96i6V7VpmEXK2GmCTCSDRCLQPVZ8O9tdY4qZB596cbMmq7DBQRY69Z58JruomQlkZSlNMOxnQY8DN17qa1mm3okB7iw/TUTRNLOmYAbDGu1VxgGRAuUDKmAl9kR+E7UbGPb7HWKjoNFKtP6SSbTxLp0fLoznIzZuXddkH9EquG1WBEO29G7+Q1jt67E/r7l+lVY5DKp4E5jlxkBFucgVRP4osgQqb087doCMgLAI9pHSuyi3spzfLJncF5D1nOVFYNyUCogLUx/Wtqi10eZlN3VR24eCpBL712Je4sxfgHq2+fjBW+Eoj1hVzgROvWQfbGo73jt0/Mg9q/+vj5oE5aR0dHKO01m0dUd06M/esc/nAO7R/9DkiNTAOp0oCRXv+wTvaarYNtro/vuBpjwmAGjCQQ4KqEjN4/OWvefkr9yCycV329dadCqirAev1gFsXIvrmAQEozxIKBw8SZRa++fP/v339I+TcgTARxys90eUSBXrqBCtq0jn72r5O90WSSqQUDj0aCCdl+AI8eRvuRS/3bYV71T96VIXTCuhjMWUq9M93/Aa/zwmEIBwAA"; 

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
print(sInfo.name,sInfo.v, "Done.\n", JSON.stringify({
  tested: results.length,
  ok: ok,
  declared: decl,
  no: no,
  level: esL
}));
	
  } else {
    // Try again in 1s if RPC not done yet
    Timer.set(1000, false, registerSplitJSON);
  }
});
