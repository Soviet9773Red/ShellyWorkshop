## Shelly Workshop 2025 - ( question to Denis )

**MIT License:** © 2025 Alexander (Soviet9773Red)
# ES6compShellyTest v1.85

JavaScript compatibility and runtime diagnostics tool for **Shelly Gen2 / Gen3 / Gen4 devices**.

This script performs a controlled set of syntax and API tests to determine which parts of **ES5 / ES6** are actually supported by the built-in Shelly JavaScript engine (MJS), which features are only declared, and which are completely missing.

---

## Purpose

Shelly Script Engine is **not a full ES6 environment**.  
Official documentation describes this only partially, which leads to trial-and-error development.

**ES6compShellyTest** provides:

- reproducible compatibility results  
- structured JSON output for automation  
- compact HTML UI for manual inspection  
- safe execution within Shelly memory and HTTP limits  

---

## Key Features (v1.85)

- Tests **70+ JavaScript features**
  - syntax (`let`, `const`, arrow, class, spread, destructuring)
  - Array / Object / String APIs
  - Date, Math, Number APIs
  - Promise, Symbol, BigInt
  - TypedArrays / ArrayBuffer
- Each feature classified as:
  - **OK** - works correctly
  - **Declared** - identifier exists but not implemented
  - **Missing** - throws error
- Safe `eval`-based execution with error classification:
  - SyntaxError
  - ReferenceError
  - TypeError
- Automatic device detection via RPC:
  - model
  - device id
  - firmware
  - MAC
- **Split JSON endpoints** to stay below 4 KB HTTP body limit
- **GZIP-compressed HTML + JS UI** served directly from Shelly
- Console output with ready-to-click endpoint URLs

---

## Compatibility Summary Logic

Based on the number of successful tests, the script estimates approximate ECMAScript level:

- `ECMAScript 3–5 (1999–2009)`
- `ECMAScript 5 + partial ES6 (2015)`
- `ES6-level feature coverage` (rare on Shelly)

This is an **estimation**, not a standards conformance claim.

---

## HTTP Endpoints

### Split JSON API

Results are split into three parts to avoid response overflow:

```
/script/<id>/es6a
/script/<id>/es6b
/script/<id>/es6c
```

Each endpoint returns:

```json
{
  "t": 82,
  "p": "A",
  "r": [
    { "f": "Array.map()", "s": "OK", "sup": 0 }
  ]
}
```

---

### GZIP Web UI

Interactive HTML table rendered directly from Shelly:

```
/script/<id>/test
```

Assets are delivered via GZIP-compressed base64 payloads:

- `/test` - HTML
- `/test.js` - JavaScript logic

No external hosting required.

---

## Console Output

On startup the script prints:

- device information (when RPC available)
- detected IP address
- full list of endpoint URLs
- compact test summary

Example:

```
HTML -> http://192.168.1.45/script/2/test
Splitted JSON endpoints:
 Part A -> http://192.168.1.45/script/2/es6a
 Part B -> http://192.168.1.45/script/2/es6b
 Part C -> http://192.168.1.45/script/2/es6c
Shelly Scripting vs JS Features test v. 1.85 Done.
```

---

## Installation

1. Open **Shelly Web UI**
2. Go to **Scripts**
3. Add new script
4. Paste content of [`ES6compShellyTest v1.85`](https://github.com/Soviet9773Red/ShellyWorkshop/blob/main/ES6compShellyTest1.85.js)
5. Save and start the script
6. Open printed URLs in a browser

---

## Supported Devices

- Shelly Plus series (Gen2)
- Shelly Pro series (Gen3)
- Firmware >= 1.6 recommended

---

## Limitations

- Not a performance benchmark
- Does not measure memory fragmentation
- Not a full JS conformance test
- Results may vary slightly across firmware versions

---

## Use Cases

- Verify which JS features are safe to use
- Decide between ES5 and ES6 syntax
- Build portable scripts across Shelly models
- Validate assumptions before refactoring code
- Educational diagnostics for Shelly scripting workshops

---

## License

MIT License

---

## Credits

Developed by **Alexander**  
project initiated during *Shelly Scripting Advanced – October 2025*


Project context:

- real-device testing
- memory-constrained runtime
- practical Shelly automation development

Assisted by GPT-based tooling for analysis and documentation.



