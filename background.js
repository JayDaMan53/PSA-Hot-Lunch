
//let isCodeRunning = false;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' /*/&& !isCodeRunning/*/) {
    //isCodeRunning = true;
    if ((tab.url == "https://docs.google.com/forms/d/e/1FAIpQLScYbWTllChTKfGcOo9tFfeQBKSE3puzfy7T6J6TEOtwW4OWpw/viewform" || tab.url == "https://docs.google.com/forms/d/e/1FAIpQLSekL_hyleGTJOzQRQj6K0qKKdBSJviiYt8sUj9BWa08VfT8cg/viewform" || tab.url == "https://docs.google.com/forms/d/e/1FAIpQLSf7lnNyFEmRpmOX_0mqx8zwb2q-rCXS-S9X_VPqyRxR3OXQ_w/viewform")) {
      attachScript(tabId, ['inject.js']);
      console.log("script attached");
      //isCodeRunning = false
    }
  }
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
        if (tab.url == "https://docs.google.com/forms/d/e/1FAIpQLScYbWTllChTKfGcOo9tFfeQBKSE3puzfy7T6J6TEOtwW4OWpw/viewform" || tab.url == "https://docs.google.com/forms/d/e/1FAIpQLSekL_hyleGTJOzQRQj6K0qKKdBSJviiYt8sUj9BWa08VfT8cg/viewform" || tab.url == "https://docs.google.com/forms/d/e/1FAIpQLSf7lnNyFEmRpmOX_0mqx8zwb2q-rCXS-S9X_VPqyRxR3OXQ_w/viewform") {
            const date = new Date();
	        const day = date.getDate();
	        chrome.storage.local.set({ Reminder: day }).then(() => {
		    console.log("Done!")
	    });
    }
}});

function attachScript(tabId, scripts, args=[], force = false) {
    chrome.scripting.executeScript({
        target: {tabId: tabId},
        func: () => {
            return typeof attachContentScript === 'undefined' ? false : true;
        }
    }, (results) => {
        if (results[0].result === false) {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: scripts
            });
        }
        if (force) {
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                func: (...args) => {
                    attachContentScript(...args);
                },
                args: args
            });
        }
    });
}

// Set the time range to remind the user to o'rder breakfast
const startTime = new Date();
startTime.setHours(0, 0, 0); // Set to midnight
const endTime = new Date();
endTime.setHours(9, 15, 0); // Set to 9am

// Create the notification options
const notificationOptions = {
  type: 'basic',
  title: 'Lunch Reminder',
  message: 'Click here to order Lunch now!',
  iconUrl: 'Logos/icon128.png'
};

// Send the notification if the current time is within the time range
const date = new Date();
const day = date.getDate();
const DayOfWeek = date.getDay();
if (DayOfWeek != 0 && DayOfWeek != 6) {
    chrome.storage.local.get(["Reminder", "SettingSave"]).then((Save) => {
        if (Save.SettingSave != undefined){
            var go = Save.Reminder != day && (Save.SettingSave[6] == true)
            if (date >= startTime && date < endTime && go) {
                chrome.notifications.create("Order", notificationOptions);
                chrome.storage.local.set({ Reminder: day }).then(() => {
                    console.log("Done!")
                });
            }
        }
    });
}

chrome.notifications.onClicked.addListener(function(notifId){
    if (notifId == "Order"){
        chrome.tabs.create({ url: 'https://docs.google.com/forms/d/e/1FAIpQLSf7lnNyFEmRpmOX_0mqx8zwb2q-rCXS-S9X_VPqyRxR3OXQ_w/viewform' });
        chrome.notifications.clear(notifId)
    }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notifId == "AReminder") {
        if (buttonIndex === 0) {
            
        } else if (buttonIndex === 1) {
            // Handle "Dismiss" button click
            chrome.notifications.clear(notificationId);
        }
    }
});

const AttendanceTimes = [
    [new Date().setHours(8, 40), new Date().setHours(9)], // 8:40 - 9:00
    [new Date().setHours(10, 15), new Date().setHours(10, 30)], // 10:15 - 10:30
    [new Date().setHours(11, 45), new Date().setHours(12)], // 11:45 - 12:00
    [new Date().setHours(12, 20), new Date().setHours(12, 30)] // 12:20 - 12:30
    [new Date().setHours(13, 50), new Date().setHours(14)] // 1:50 - 2:00
]

const AttendancenotificationOptions = {
    type: 'basic',
    title: 'Attendance Reminder',
    message: 'Take Attendance!',
    iconUrl: 'Logos/icon128.png',
    buttons: [
        { title: "Sleep for 5 min" },
        { title: "Dismiss" }
    ]
};

if (DayOfWeek != 0 && DayOfWeek != 6) {
    chrome.storage.local.get(["AttendanceReminder", "SettingSave"]).then((Save) => {
        if (Save.SettingSave != undefined){

            let TimeOfDayID = null

            for (let i = 0; i <= 5; i++) {
                const TimeSlot = AttendanceTimes[i]
                if (TimeSlot) {
                    if (date >= TimeSlot[0] && date < TimeSlot[1] && Save.SettingSave[8][i]) {
                        TimeOfDayID = i
                        break
                    }
                }
            }

            var go = Save.AttendanceReminder != TimeOfDayID && (Save.SettingSave[7] == true)
            if (TimeOfDayID && go) {
                chrome.notifications.create("AReminder", AttendancenotificationOptions);
                chrome.storage.local.set({ AttendanceReminder: TimeOfDayID }).then(() => {
                    console.log("Done!")
                });
            }
        }
    });
}