var FirstName = document.querySelector("#FirstName");
var LastName = document.querySelector("#LastName");
var Email = document.querySelector("#Email");
var Lunch1 = document.getElementById("Lunch1");
var Breakfast = document.querySelector("#Breakfast");
var Mode = document.getElementById("Mode")
var NotificationReminder = document.getElementById("Notification Reminder")
var SaveButton = document.getElementById("Save")
var Attendance = document.getElementById("Attendance Reminders")
var Classes = document.getElementById("Classes")

chrome.storage.local.get(["SettingSave"], function(SaveData) {
    if (SaveData.SettingSave) {
        FirstName.value = SaveData.SettingSave[0];
        LastName.value = SaveData.SettingSave[1];
        Email.value = SaveData.SettingSave[2];
        Lunch1.selectedIndex = SaveData.SettingSave[4];
        Mode.selectedIndex = SaveData.SettingSave[5];
        // notifs
        NotificationReminder.checked = SaveData.SettingSave[6];
        // teachers
        Attendance.checked = SaveData.SettingSave[7];
        Classes.hidden = !SaveData.SettingSave[7];

        for (let i = 0; i <= 10; i++) {
            const checkbox = document.getElementById("Classes").querySelectorAll('input[type="checkbox"]')[i];
            if (checkbox) {
                checkbox.checked = SaveData.SettingSave[8][i]
            }
        }
    }
});

SaveButton.addEventListener('click', function() {
    const checkedValues = [];
    for (let i = 0; i <= 10; i++) {
        const checkbox = document.getElementById("Classes").querySelectorAll('input[type="checkbox"]')[i];
        if (checkbox) {
            checkedValues[i] = checkbox.checked
        }
    }

    var SaveDataList = [
        FirstName.value,
        LastName.value,
        Email.value,
        "null",
        Lunch1.selectedIndex,
        Mode.selectedIndex,
        NotificationReminder.checked,
        Attendance.checked,
        checkedValues
    ];
    chrome.storage.local.set({ SettingSave: SaveDataList }, function() {
        console.log("Done!");
    });
});

Attendance.addEventListener("change", function () {
    Classes.hidden = !this.checked
});