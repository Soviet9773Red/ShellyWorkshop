// MemoryV1.0
//Memory
Shelly.call("Sys.GetStatus", {}, function (response) {
    if (response) {
        let ramSize = response.ram_size || 0;
        let ramFree = response.ram_free || 0;
        let ramUsed = ramSize - ramFree;
        print("Общий объём памяти: " + ramSize + " байт");
        print("Свободная память: " + ramFree + " байт");
        print("Используемая память: " + ramUsed + " байт");
        print("=======================");
    } else {
        print("Ошибка получения данных о памяти: " + JSON.stringify(response));
    }
});