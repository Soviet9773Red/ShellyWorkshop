// MemoryV1.0
//Memory
Shelly.call("Sys.GetStatus", {}, function (response) {
    if (response) {
        let ramSize = response.ram_size || 0;
        let ramFree = response.ram_free || 0;
        let ramUsed = ramSize - ramFree;
        print("Total RAM: " + ramSize + " bites");
        print("Free RAM: " + ramFree + " bites");
        print("Used RAM: " + ramUsed + " bites");
        print("=======================");
    } else {
        print("Error: " + JSON.stringify(response));
    }

});

