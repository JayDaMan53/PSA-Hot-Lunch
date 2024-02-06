function getBusinessDays(startDate, endDate) {
	let days = 0;
	let currentDate = new Date(startDate);
	while (currentDate <= endDate) {
	  let dayOfWeek = currentDate.getDay();
	  if (dayOfWeek !== 0 && dayOfWeek !== 6) {
		days++;
	  }
	  currentDate.setDate(currentDate.getDate() + 1);
	}
	return days;
  }
  const date = new Date();
  let endDate = new Date('2023-06-6');
  let businessDays = getBusinessDays(date, endDate);

let day = date.getDate();
let month = date.getMonth();

async function getdata() {
    const url1 = 'https://raw.githubusercontent.com/JayDaMan53/PSA-Hot-Lunch/main/lunch_schedule_data.txt';
    try {
        const response = await fetch(url1);
        const data = await response.text();

        // Execute the fetched JavaScript code
        //eval(data);
		console.log(data)
		//return [lunchList, AB_Schedule]
		return data
    } catch (error) {
        console.error('Failed to fetch or execute data:', error);
    }
}

async function main() {
    try {
        // Assuming getdata is a function that returns a promise
        const data = await getdata(); // Wait for getdata to finish
        const lines = data.split('\n');
		const lunchList = {};
		const AB_Schedule = {};
		let currentObject = null;

		lines.forEach(line => {
			if (line.startsWith('lunchList = {')) {
			currentObject = lunchList;
			} else if (line.startsWith('AB_Schedule = {')) {
			currentObject = AB_Schedule;
			} else if (line.match(/^\s+\d+: {/)) { // New sub-object
			const key = line.match(/^\s+(\d+): {/)[1];
			currentObject[key] = {};
			} else if (line.match(/^\s+\d+: ".+"/)) { // Key-value pair
			const matches = line.match(/^\s+(\d+): "(.+)"/);
			const key = matches[1];
			const value = matches[2];
			const lastKey = Object.keys(currentObject)[Object.keys(currentObject).length - 1];
			currentObject[lastKey][key] = value;
			}
		});

		console.log('Lunch List:', lunchList);
		console.log('AB Schedule:', AB_Schedule);

        let monthNAMES = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]; document.getElementById("Hedether").innerHTML = "Lunch for " + monthNAMES[month];

		document.getElementById("Thedate").innerHTML = (month + 1) + "/" + day + "/" + date.getFullYear()

		document.getElementById("Lunch").innerHTML = "Todays hot-lunch: " + lunchList[month][day];
		document.getElementById("next lunch").innerHTML = "Tomorrow's hot-lunch: " + lunchList[month][day + 1];

		if (lunchList[month][day] == undefined) {
			document.getElementById("Lunch").innerHTML = "Todays hot-lunch: N/A"
		}
		if (lunchList[month][day + 1] == undefined) {
			document.getElementById("next lunch").innerHTML = "Tomorrow's hot-lunch: N/A"
		}

		if (AB_Schedule[month][day] == "Leap") {
			document.getElementById("AB").innerHTML = "Today is an Leap day!"
		} else if (AB_Schedule[month][day] == "A Weekend") {
			if (AB_Schedule[month][day + 1] != "A Weekend") {
				if (AB_Schedule[month][day + 1] == "A") {
					document.getElementById("AB").innerHTML = "Today is a Weekend! <br> Tomorrow is an A day!"
				} else if (AB_Schedule[month][day + 1] == "B") {
					document.getElementById("AB").innerHTML = "Today is a Weekend! <br> Tomorrow is a B day!"
				} else {
					if (AB_Schedule[month][day + 1]) {
						document.getElementById("AB").innerHTML = "Today is a Weekend! <br> Tomorrow is " + AB_Schedule[month][day + 1] + "!"
					} else {
						document.getElementById("AB").innerHTML = "Today is a Weekend!"
					}
				}
			} else {
				document.getElementById("AB").innerHTML = "Today is a Weekend!"
			}
		} else {
			if (AB_Schedule[month][day] == "A") {
					document.getElementById("AB").innerHTML = "Today is an A day!"
				}
				else if (AB_Schedule[month][day] == "B") {
					document.getElementById("AB").innerHTML = "Today is a B day!"
				}
				else if (AB_Schedule[month][day] == "C") {
					document.getElementById("AB").innerHTML = "Today is a C day!"
			} else {
				document.getElementById("AB").innerHTML = "Today is " + AB_Schedule[month][day] + "!"
			}
		}

		if (AB_Schedule[month][day] == undefined) {
			document.getElementById("AB").innerHTML = "Error loading..."
		}
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main(); // Don't forget to call the main function

document.getElementById("Settings").addEventListener("click", function() {
	  chrome.runtime.openOptionsPage();
	});
document.getElementById("SettingsLink").addEventListener("click", function() {
	chrome.runtime.openOptionsPage();
  });

function DarkLight(on) {
	if (on) {
		document.getElementById("dark-mode-toggle").checked = true
		document.body.classList.add("dark-mode");
		for (const child of document.body.children) {
			if (child.nodeName == "A") {
				child.classList.remove("link")
				child.classList.add("dark-mode-link")
			} else if (child.nodeName == "h3" || child.className == "rounded-text-box") {
				child.classList.remove("rounded-text-box")
				child.classList.add("rounded-text-box-dark")
			} else if (child.className == "SandwichClickerLight") {
				child.classList.remove("SandwichClickerLight")
				child.classList.add("SandwichClickerDark")
			}
		  }
	} else {
		document.body.classList.remove("dark-mode")
		for (const child of document.body.children) {
			if (child.nodeName == "A") {
				child.classList.add("link")
				child.classList.remove("dark-mode-link")
			} else if (child.nodeName == "h3" || child.className == "rounded-text-box-dark") {
				child.classList.add("rounded-text-box")
				child.classList.remove("rounded-text-box-dark")
			} else if (child.className == "SandwichClickerDark") {
				child.classList.add("SandwichClickerLight")
				child.classList.remove("SandwichClickerDark")
			}
		}
	}
}

chrome.storage.local.get(["DarkMode"]).then((DarkMode) => {
	if (DarkMode.DarkMode) {
		DarkLight(true)
	}
});


const toggle = document.getElementById("dark-mode-toggle");

toggle.addEventListener("change", function () {
	if (this.checked) {
		chrome.storage.local.set({ DarkMode: true }).then(() => {
			console.log("Done!")
		});
		DarkLight(true)
		chrome.storage.local.get(["Awards"]).then((Awards) => {
			if (Awards.Awards["FirstDarkMode"] == false) {
				var Save = Awards.Awards
				Save["FirstDarkMode"] = true
				chrome.storage.local.set({ Awards: Save }).then(() => {
					Award("Dark Mode", "That feels better!", 10000)
				})
			}
		})
		
	} else {
		chrome.storage.local.set({ DarkMode: false }).then(() => {
			console.log("Done!")
		});
		DarkLight(false)
	}
});

/*/var currentDate = new Date(); // Get the current date
var date1 = new Date(currentDate.getFullYear(), 3, 1); // April 1 of the current year
var date2 = new Date(currentDate.getFullYear(), 4, 1); // May 1 of the current year

if (currentDate >= date1 && currentDate < date2) {
	document.getElementById("ad1").src = "ADs/Mr. Reetz Snack Cart!.png"
} else {
	document.getElementById("ad1").src = "ADs/ADBlank.png"
}/*/
document.getElementById("ad1").remove()
document.getElementById("ad2").remove()
/*/var date3 = new Date(currentDate.getFullYear(), 3, 1); // April 1 of the current year
var date4 = new Date(currentDate.getFullYear(), 4, 1); // May 1 of the current year

if (currentDate >= date3 && currentDate < date4) {
  document.getElementById("ad1").src = ""
} else {
  document.getElementById("ad1").src = "ADs/ADBlank.png"
}
/*/

function Award(AwardName, AwardDescription, TimeOnScreen) {
	var clicker = document.getElementsByClassName("SandwichClicker")[0]
	if (clicker.classList == "SandwichClicker") {
		clicker.children[2].innerHTML = AwardName
		clicker.children[4].innerHTML = AwardDescription
		chrome.storage.local.get(["DarkMode"]).then((DarkMode) => {
			if (!DarkMode.DarkMode) {
				clicker.classList.remove("SandwichClicker")
				clicker.classList.add("SandwichClickerLight")
				setTimeout(function() {
						chrome.storage.local.get(["DarkMode"]).then((DarkMode) => {
							if (DarkMode.DarkMode) {
								clicker.classList.add("SandwichClickerOff")
								clicker.classList.remove("SandwichClickerDark")
								setTimeout(function() {
									clicker.classList.add("SandwichClicker")
									clicker.classList.remove("SandwichClickerOff")
								  }, 1000);
							} else {
								clicker.classList.add("SandwichClicker")
								clicker.classList.remove("SandwichClickerLight")
							}
						})
				  }, TimeOnScreen);
			} else {
				clicker.classList.remove("SandwichClicker")
				clicker.classList.add("SandwichClickerDark")
				setTimeout(function() {
					clicker.classList.add("SandwichClickerOff")
					clicker.classList.remove("SandwichClickerDark")
	
					setTimeout(function() {
						clicker.classList.add("SandwichClicker")
						clicker.classList.remove("SandwichClickerOff")
						clicker.classList.remove("SandwichClickerLight")
					  }, 1000);
				  }, TimeOnScreen);
			}
		});
	}
}

/*/var clicks = 0;
var array = document.getElementsByName("ChickenSandwich");
for (let index = 0; index < array.length; index++) {
	const element = array[index];
	element.addEventListener("click", function() {
		clicks += 1;
		if (clicks == 1) {
			Award("Sandwich...", "Click The Sandwich!", 5000);
		}
		if (clicks == 50) {
			Award("Sandwich Clicker 1", "Click The Sandwich 50 times!", 5000);
		}
		if (clicks == 100) {
			Award("Sandwich Clicker 2", "Click The Sandwich 100 times!!", 10000);
		}
	});
}/*/


chrome.storage.local.get(["Awards"]).then((Awards) => {
	console.log(Awards)
	if (!Awards.Awards) {
		chrome.storage.local.set({ Awards: {"DaysUsed": [1, day], "FirstDarkMode": false} }).then(() => {
			Award("Welcome!", "Hope you enjoy!", 5000)
		});
	} else {
		if (Awards.Awards["DaysUsed"][1] != day) {
			var Save = Awards.Awards
			Save["DaysUsed"][0] += 1
			Save["DaysUsed"][1] = day

			chrome.storage.local.set({ Awards: Save }).then(() => {
				if (Save["DaysUsed"][0] == 5) {
					Award("Getting Warmed Up", "Use on 5 different days", 10000)
				}
				if (Save["DaysUsed"][0] == 20) {
					Award("Hot Lunch Pro", "Use on 20 different days", 10000)
				}
				if (Save["DaysUsed"][0] == 50) {
					Award("Wow look at the time!", "Use on 50 different days", 15000)
				}
				if (Save["DaysUsed"][0] == 100) {
					Award("Your a MEGA fan! Thanks For Your Suport!", "Use on 100 different days", 20000)
				}
				if (Save["DaysUsed"][0] == 150) {
					Award('<a href="https://forms.gle/CdUVfheXujn4Qf7XA" target="_blank" rel="noopener noreferrer">Welcome! click here to claim your prize!</a>', "Use on 150 different days", 20000)
				}
			});
		}
	}
});
