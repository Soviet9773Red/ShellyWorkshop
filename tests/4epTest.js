// Pro3 tester V.1.1
// Test script for checking the maximum HTTP response size for four endpoints
function createTestEndpoint(endpointName, defaultLength) {
  HTTPServer.registerEndpoint(endpointName, function(req, res) {
    // Read the "length" query parameter
    var params = req.query || {};
    var desired = parseInt(params.length, 10);
    if (isNaN(desired) || desired < 0) {
      desired = defaultLength; // Default value if not specified or invalid
    }
    // Set the number of characters per line before inserting a <br> tag
    var n = 100;
    // Define maximum allowed length (in bytes)
    var maxL = 4081 //4081;
    
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
    var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
    html += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    html += "<title>Test Endpoint - " + endpointName + "</title></head><body>";
    // Insert the navigation menu
    html += "<nav style='display: flex; justify-content: space-around; background: #8f5079; padding: 10px;'>";
    html += "<a href='/script/" + scriptId + "/' style='color: #fff; text-decoration: none; margin: 0 10px;'>+0</a>";
    html += "<a href='/script/" + scriptId + "/2' style='color: #fff; text-decoration: none; margin: 0 10px;'>+1</a>";
    html += "<a href='/script/" + scriptId + "/3' style='color: #fff; text-decoration: none; margin: 0 10px;'>+2</a>";
    html += "<a href='/script/" + scriptId + "/4' style='color: #fff; text-decoration: none; margin: 0 10px;'>+3</a>";
	html += "<a href='/script/" + scriptId + "/5' style='color: #fff; text-decoration: none; margin: 0 10px;'>+4</a>";
    html += "</nav>";
    // Continue with the rest of the content
    html += "<div>Final test string for endpoint '" + endpointName + "':<br>" + filler + "</div>";
    html += "<div>Test string length: " + desired + " characters</div>";
    html += "<div id='finalLength'></div>";
    // Client-side script calculates and displays the final HTML length and remaining bytes
    html += "<script>";
    html += "var currentLength = document.documentElement.outerHTML.length;";
    html += "document.getElementById('finalLength').innerText = 'Summary HTML length: ' + currentLength + ' bytes. Remaining: ' + (" 
          + maxL + " - currentLength) + ' bytes.';";
    html += "</script>";
    html += "</body></html>";
    
    res.body = html;
    res.code = 200;
    res.send();
  });
}
var b = 2904;
// Create four endpoints "test1", "test2", "test3" and "test4" with the same default length
function iniHTTP_4ep() {
createTestEndpoint("", b);
createTestEndpoint("2", (b+1));
createTestEndpoint("3", (b+2));
createTestEndpoint("4", (b+3));
createTestEndpoint("5", (b+4));
}
iniHTTP_4ep();
// For convenience, print the endpoints' URLs in the console
let wifiStatus = Shelly.getComponentStatus("wifi");
let ip = wifiStatus.sta_ip || "192.168.33.1";
print("[Test Endpoint 1] Available at: http://" + ip + "/script/" + Shelly.getCurrentScriptId() );