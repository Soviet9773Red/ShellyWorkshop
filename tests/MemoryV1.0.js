// MemoryV1.0
//Memory
Shelly.call("Sys.GetStatus", {}, function (response) {
    if (response) {
        let ramSize = response.ram_size || 0;
        let ramFree = response.ram_free || 0;
        let ramUsed = ramSize - ramFree;
        print("Total RAM: " + ramSize + " байт");
        print("Free RAM: " + ramFree + " байт");
        print("Used RAM: " + ramUsed + " байт");
        print("=======================");
    } else {
        print("Error: " + JSON.stringify(response));
    }

});
