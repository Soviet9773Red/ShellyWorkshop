# ShellyWorkshop2025 - Question to Denis

### Purpose
Shelly devices use a lightweight JavaScript engine (MJS) that supports only a subset of ES5/ES6.  
This test script runs a series of syntax and function checks to reveal which JS features are functional, declared but not implemented, or completely missing.

---

### ⚙️ Features
- Detects support for key JavaScript features: `let`, `const`, `map`, `filter`, `reduce`, `Promise`, `Symbol`, `class`, `BigInt`, etc.  
- Shows **Support Level**:  
  - ✅ **Full** – works correctly  
  - ⚠️ **Declared** – identifier exists but not implemented  
  - ❌ **Missing** – feature not recognized or causes an error  
- Automatically detects device info (model, firmware, ID, MAC).  
- Provides two built-in endpoints:  
  - `http://<device_ip>/script/<id>/es6` → JSON report  
  - `http://<device_ip>/script/<id>/es6html` → formatted HTML table  
- Prints endpoint URLs automatically in the Shelly console at startup.

---

### 🧩 Example Output

**Firmware:** `1.7.1 (20250924-062712/1.7.1-gd336f31)`  
**Device:** `S3SW-001P8EU (shelly1pmminig3-28372f27246c)`

| # | Feature / API        | Result | Support | Notes              |
|:-:|-----------------------|:------:|:--------:|--------------------|
| 1 | `let / const`         | ✅ | Full | Works correctly |
| 3 | `Arrow =>`            | ❌ | Missing | ReferenceError |
| 7 | `Array.reduce()`      | ❌ | Missing | Not implemented |
| 17 | `JSON.stringify()`   | ✅ | Full | Works correctly |
| 20 | `Promise`            | ❌ | Missing | ReferenceError |
| 22 | `BigInt`             | ❌ | Missing | ReferenceError |

---

### 📘 Summary
Compatibility ≈ *ECMAScript 5 (2009)* + partial *ES6 (2015)*.  
Fully supported: `map`, `filter`, `every`, `some`, `forEach`, `Object.assign`, `JSON.stringify`.  
Missing: arrow functions, classes, template literals, `reduce`, `find*`, `includes*`, `Promise`, `BigInt`.

---

### 🖥️ Installation
1. Open the Shelly Web UI → **Scripts** → **Add Script**  
2. Paste the content of the latest `ES6compShellyTestV1.83.js`  
3. Click **Start**  
4. Watch the console for your device IP and endpoint URLs  
5. Open the HTML endpoint in a browser to view the compatibility matrix

---

### 📑 Notes
- Works on Shelly Plus and Pro Gen3 devices with firmware ≥ 1.6  
- Does **not** measure memory or CPU limitations — only language-level JS support  
- Output size < 4 KB to remain within HTTP body limits of the Shelly Script Engine  

---

### 🧠 Credits
Developed and tested by **Alexander** during the *Shelly Scripting Advanced – October 2025* workshop.  
Built collaboratively with **GPT-5** as part of an experimental diagnostic toolkit for the Shelly developer community.



