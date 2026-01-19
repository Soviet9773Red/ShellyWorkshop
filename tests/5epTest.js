/*
 * Shelly HTTP endpoints tester V.1.3
 * (c) 2026 Alexander Soviet9773Red | https://github.com/Soviet9773Red
 * Test script for checking the maximum HTTP response size for five endpoints
 * MIT License
*/

function createTestEndpoint(eP, defaultLength) {
  HTTPServer.registerEndpoint(eP, function(req, res) {
    // Read the "length" query parameter
    var params = req.query || {};
    var desired = parseInt(params.length, 10);
    if (isNaN(desired) || desired < 0) {
      desired = defaultLength; // Default value if not specified or invalid
    }
    // Set the number of characters per line before inserting a <br> tag
    var n = 100;
    // Define maximum allowed length (in bytes)
    var maxL = 4096 //4081;
    
    // Create the filler string with a <br> tag every n characters
    var filler = "";
    for (var i = 0; i < desired; i++) {
      filler += "*";
      if ((i + 1) % n === 0) {
        filler += "<br>";
      }
    }
    // Get the current script id for dynamic link generation
    var scriptId = Shelly.getCurrentScriptId();

    // Build the HTML page. Note: The total length includes the entire HTML.
	let html = "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
	
    html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    html += "<title>Test/- " + eP + "</title></head><body>";
    // Insert the navigation menu
    html += "<nav style='display: flex; justify-content: space-around; background: #8f5079; padding: 10px;'>";
    html += "<a href='/script/" + scriptId + "/' style='color: #fff; text-decoration: none; margin: 0 10px;'>936</a>";
    html += "<a href='/script/" + scriptId + "/2' style='color: #fff; text-decoration: none; margin: 0 10px;'>4094</a>";
    html += "<a href='/script/" + scriptId + "/3' style='color: #fff; text-decoration: none; margin: 0 10px;'>4095</a>";
    html += "<a href='/script/" + scriptId + "/4' style='color: #fff; text-decoration: none; margin: 0 10px;'>4096</a>";
	html += "<a href='/script/" + scriptId + "/5' style='color: #fff; text-decoration: none; margin: 0 10px;'>☠</a>";
    html += "</nav>";
    // Continue with the rest of the content
    html += "<div>Test endpoint/'" + eP + "':<br>" + filler + "</div>";
    html += "<div>Test: " + desired + " * + JS-HTML, check console!</div>";
    html += "<div id='finalLength'></div>";
	// end of HTML
    html += "</body></html>";
    // Server-side calculates and displays the final HTML length and remaining bytes
	let HL = html.length;
	print("[EP " + eP + "] HTML.body length: " + HL + " bytes, remaining: " + (maxL - HL));
    res.body = html;
    res.code = 200;
    res.send();
  });
}

// Specify test length
const b = 3142;// html ~ 936
// Create four endpoints ../script/nr "/", "/2", "/3", "/4" and "/5" 
function iniHTTP_4ep() {
createTestEndpoint("", b-3034);
createTestEndpoint("2", (b+1));
createTestEndpoint("3", (b+2));
createTestEndpoint("4", (b+3));
createTestEndpoint("5", (b+4)); // * length for the test
}
iniHTTP_4ep();
// For convenience, print the endpoints' URLs in the console
let wifiStatus = Shelly.getComponentStatus("wifi");
let ip = wifiStatus.sta_ip || "192.168.33.1";
print("[Test Endpoint 1] Available at: http://" + ip + "/script/" + Shelly.getCurrentScriptId() );
