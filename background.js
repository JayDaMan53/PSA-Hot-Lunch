
//let isCodeRunning = false;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete' /*/&& !isCodeRunning/*/) {
    //isCodeRunning = true;
    if ((tab.url == "https://docs.google.com/forms/d/e/1FAIpQLScYbWTllChTKfGcOo9tFfeQBKSE3puzfy7T6J6TEOtwW4OWpw/viewform" || tab.url == "https://docs.google.com/forms/d/e/1FAIpQLSekL_hyleGTJOzQRQj6K0qKKdBSJviiYt8sUj9BWa08VfT8cg/viewform")) {
      attachScript(tabId, ['inject.js']);
      console.log("script attached");
      //isCodeRunning = false
    }
  }
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
        if (tab.url == "https://docs.google.com/forms/d/e/1FAIpQLScYbWTllChTKfGcOo9tFfeQBKSE3puzfy7T6J6TEOtwW4OWpw/viewform") {
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
                chrome.notifications.create(notificationOptions);
                chrome.storage.local.set({ Reminder: day }).then(() => {
                    console.log("Done!")
                });
            }
        }
    });
}

chrome.notifications.onClicked.addListener(function(notifId){
    chrome.tabs.create({ url: 'https://docs.google.com/forms/d/e/1FAIpQLScYbWTllChTKfGcOo9tFfeQBKSE3puzfy7T6J6TEOtwW4OWpw/viewform' });
    chrome.notifications.clear(notifId)
});