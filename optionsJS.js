var FirstName = document.querySelector("#FirstName");
var LastName = document.querySelector("#LastName");
var Email = document.querySelector("#Email");
var Lunch1 = document.getElementById("Lunch1");
var Breakfast = document.querySelector("#Breakfast");
var Mode = document.getElementById("Mode")
var NotificationReminder = document.getElementById("Notification Reminder")
var SaveButton = document.getElementById("Save")

chrome.storage.local.get(["SettingSave"], function(SaveData) {
    if (SaveData.SettingSave) {
        FirstName.value = SaveData.SettingSave[0];
        LastName.value = SaveData.SettingSave[1];
        Email.value = SaveData.SettingSave[2];
        Lunch1.selectedIndex = SaveData.SettingSave[4];
        Mode.selectedIndex = SaveData.SettingSave[5];
        if (SaveData.SettingSave[6] == undefined) {
            NotificationReminder.checked = false
        } else {
            NotificationReminder.checked = SaveData.SettingSave[6];
        }
    }
});

SaveButton.addEventListener('click', function() {
    var SaveDataList = [
        FirstName.value,
        LastName.value,
        Email.value,
        "null",
        Lunch1.selectedIndex,
        Mode.selectedIndex,
        NotificationReminder.checked
    ];
    chrome.storage.local.set({ SettingSave: SaveDataList }, function() {
        console.log("Done!");
    });
});