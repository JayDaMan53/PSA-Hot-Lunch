if (!document.getElementById("PSA-AutoFill")) {
	console.log('Auto fill script injected!');
	function RunFILL(SaveData) {
		console.log("Filled");
		document.getElementById("PSAStyle").innerHTML = '.box { border: 0.5px solid rgb(255, 255, 255); border-radius: 10px; padding: 10px; box-shadow: 3px 3px 5px #555; position: fixed; left: 5%; top: 80%; width: 120; color: white; font-weight: bold; background-color: rgb(0, 0, 0); } #text-container { display: inline-block; margin-left: 10px; vertical-align: top; } #Lunch, #next-lunch { display: block; }'
	
		document.getElementById("PSAPhotoBox").removeEventListener("click", RunFILL)
		chrome.storage.local.get(["SettingSave"], function(SaveData) {
		let email = SaveData.SettingSave[2];
		let FirstName = SaveData.SettingSave[0];
		let LastName = SaveData.SettingSave[1]
		let grade = SaveData.SettingSave[3];
		let Firstlunch = SaveData.SettingSave[4];
		// leave as 1 for hot lunch or no second lunch.
		// 1 = Hot Lunch, 2 = Cheese Pizza, 3 = Pepperoni Pizza, 4 = Salad, 5 = Wrap or Sub
		console.log(SaveData.SettingSave)
		if (email == null || FirstName == null || LastName == null || grade == null || Firstlunch == null || email == '' || FirstName == '' || LastName == '') {
			//chrome.runtime.openOptionsPage();
		} else {
			// Use email here
			// Assuming your element is an input or textarea
			document.getElementsByClassName("whsOnd zHQkBf")[0].focus();
			document.execCommand('insertText', false, email);
		
			document.getElementsByClassName("whsOnd zHQkBf")[1].focus();
			document.execCommand('insertText', false, FirstName);
		
			document.getElementsByClassName("whsOnd zHQkBf")[2].focus();
			document.execCommand('insertText', false, LastName);
		
			document.getElementsByClassName("AB7Lab Id5V1")[Firstlunch].click()
	}})}
	
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth();

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

	chrome.storage.local.get(["SettingSave"], function(SaveData) {

		let email = SaveData.SettingSave[2];
		let FirstName = SaveData.SettingSave[0];
		let LastName = SaveData.SettingSave[1]
		let Firstlunch = SaveData.SettingSave[4];

		if (SaveData.SettingSave[5] == 0) {
			var div = document.createElement('div');
			div.id = "PSA-AutoFill"
			div.innerHTML = '<style id="PSAStyle"> .box { border: 0.5px solid rgb(255, 255, 255); border-radius: 10px; padding: 10px; box-shadow: 3px 3px 5px #555; position: fixed; left: 5%; top: 80%; width: 120; color: white; font-weight: bold; background-color: rgb(0, 0, 0); } .aaa:hover { cursor: pointer; } #text-container { display: inline-block; margin-left: 10px; vertical-align: top; } #Lunch, #next-lunch { display: block; } </style> <div class="box" id="PSAPhotoBox"> <img id="PSAPhoto" src="https://bashify.io/img/6c0138a21d96d607fcb6c457d1b4a6cc" alt="Fill-PSA" width="75" height="75"><div id="text-container"> <b style="font-size: 5;" id="Lunch">Loading...</b><p style="font-size: 1;"></p><b style="font-size: 5;" id="next-lunch">Loading...</b> </div> <img src="https://i.ibb.co/QCjKgXt/X.webp" alt="Fill-PSA" width="25" height="25" style="position: absolute; top: 85px; left: 240px;" title="Please set up auto-fill in the settings" id="Disabled/Enabled"></div>';
			document.body.appendChild(div);
			async function abcd() {
				const data = await getdata(); // Wait for getdata to finish
				const lines = data.split('\n');
				const lunchList = {};
				const AB_Schedule = {};
				let imgLink = ""; // Initialize imgLink as an empty string
				let version = ""; // Initialize version as an empty string
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
					} else if (line.startsWith('imgLink = "')) { // imgLink assignment
						imgLink = line.match(/^imgLink = "(.+)"/)[1];
					} else if (line.startsWith('version = "')) { // version assignment
						version = line.match(/^version = "(.+)"/)[1];
					}
				});

				console.log('Lunch List:', lunchList);
				console.log('AB Schedule:', AB_Schedule);
				console.log('Image Link:', imgLink); // Log the imgLink
				console.log('Version:', version); // Log the version
				
				document.getElementById("Lunch").innerHTML = "Todays hot-lunch:<br>" + lunchList[month][day];
				document.getElementById("next-lunch").innerHTML = "Tomorrow's hot-lunch:<br>" + lunchList[month][day + 1];
			}
			abcd()
			if (email != null && FirstName != null && LastName != null && Firstlunch != null && email != '' && FirstName != '' && LastName != '') {
				document.getElementById("Disabled/Enabled").remove()
				document.getElementById("PSAPhotoBox").classList.add("aaa")
				document.getElementById("PSAPhotoBox").addEventListener("click", RunFILL)
			} else {
				if (email == null && FirstName == null && LastName == null && Firstlunch == null) {
					document.getElementById("Disabled/Enabled").title = "Please set up auto-fill in the settings"
				} else if (email == '' && FirstName == '' && LastName == '') {
					document.getElementById("Disabled/Enabled").title = "Please fill in your name, email, and last name in the settings"
				} else if (email == '' && FirstName == '') {
					document.getElementById("Disabled/Enabled").title = "Please fill in your email and first name in the settings"
				} else if (email == '' && LastName == '') {
					document.getElementById("Disabled/Enabled").title = "Please fill in your email and last name in the settings"
				} else if (FirstName == '' && LastName == '') {
					document.getElementById("Disabled/Enabled").title = "Please fill in your first and last name in the settings"
				} else if (FirstName == '') {
					document.getElementById("Disabled/Enabled").title = "Please fill in your first name in the settings"
				} else if (LastName == '') {
					document.getElementById("Disabled/Enabled").title = "Please fill in your last name in the settings"
				} else if (email == '') {
					document.getElementById("Disabled/Enabled").title = "Please fill in your email name in the settings"
				} else {
					document.getElementById("Disabled/Enabled").title = "Something has gone wrong please try setting up auto-fill in the settings"
				}
			}

			if (lunchList[month][day] == undefined) {
				document.getElementById("Lunch").innerHTML = "Todays hot-lunch:<br>N/A"
			}
			if (lunchList[month][day + 1] == undefined) {
				document.getElementById("next-lunch").innerHTML = "Tomorrow's hot-lunch:<br>N/A"
			}
		} else {
	
			var div = document.createElement('div');
			div.id = "PSA-AutoFill"
			div.innerHTML = '<style id="PSAStyle"> .box { border: 0.5px solid rgb(255, 255, 255); border-radius: 10px; padding: 10px; box-shadow: 3px 3px 5px #555; position: fixed; left: 5%; top: 80%; width: 120; color: white; font-weight: bold; background-color: rgb(0, 0, 0); } #text-container { display: inline-block; margin-left: 10px; vertical-align: top; } #Lunch, #next-lunch { display: block; } </style> <div class="box" id="PSAPhotoBox"> <img id="PSAPhoto" src="https://bashify.io/img/6c0138a21d96d607fcb6c457d1b4a6cc" alt="Fill-PSA" width="75" height="75"><div id="text-container"> <b style="font-size: 5;" id="Lunch">Loading...</b><p style="font-size: 1;"></p><b style="font-size: 5;" id="next-lunch">Loading...</b> </div></div>';
			document.body.appendChild(div);
			
			async function Stuff() {
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

				document.getElementById("Lunch").innerHTML = "Todays hot-lunch:<br>" + lunchList[month][day];
				document.getElementById("next-lunch").innerHTML = "Tomorrow's hot-lunch:<br>" + lunchList[month][day + 1];
				
				if (SaveData.SettingSave[5] == 1) {
					RunFILL(SaveData)
				}
			}
			Stuff()
		}
	});
} else {
	console.error("already exists");
}