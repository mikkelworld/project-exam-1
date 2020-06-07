const pastLaunchesContainer = document.getElementById("past-launches-wrapper");
const upcomingLaunchesContainer = document.getElementById("upcoming-launches-wrapper");
const countdown = document.getElementById("nextLaunchCountdown");
const liveStreamLink = document.getElementById("btnLivestream");

// Gets past launches from SpaceX API
fetch("https://api.spacexdata.com/v3/launches/past?sort=launch_date_utc&order=desc&limit=6")
	.then(data => {
		return data.json();
	})
	.then(json => {
		createPastLaunches(json);
	})
	.catch(error => {
		console.log("Unable to get past launches data: " + error);
	});

// Gets upcoming launches from SpaceX API
fetch("https://api.spacexdata.com/v3/launches/upcoming?sort=launch_date_utc")
	.then(data => {
		return data.json();
	})
	.then(json => {
		// Filter out past launches
		// The API endpoint for 'upcoming' launches still returns launches that have already taken place.
		// Since the API cannot be relied on to be entirely accurate, this workaround at least prevents the site from displaying past dates for 'upcoming' launches.
		var upcomingLaunches = json.filter(function (launch) {
			return new Date(launch.launch_date_utc) > new Date();
		});

		createUpcomingLaunches(upcomingLaunches);
		createLaunchCountdown(upcomingLaunches);
	})
	.catch(error => {
		console.log("Unable to get upcoming launches data: " + error);
	});

// Creates countdown timer till next launch
function createLaunchCountdown(upcomingLaunches) {
	// Safety measure for empty launch schedule
	if (upcomingLaunches.length <= 0) {
		countdown.innerText = "No scheduled launches";
		
		if (!liveStreamLink.classList.contains("hidden"))
			liveStreamLink.classList.add("hidden");
		
		return;
	}

	var launchDate = new Date(upcomingLaunches[0].launch_date_utc).getTime();

	// Update countdown every second
	var timer = setInterval(function () {
		// Get difference between launch date and now
		var difference = (launchDate - Date.now());
		// Calculate timespan components
		var daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
		var hoursLeft = Math.floor(difference / (1000 * 60 * 60) % 24)
		var minutesLeft = Math.floor(difference / (1000 * 60) % 60);
		var secondsLeft = Math.floor(difference / 1000 % 60);
		// Update countdown element
		countdown.innerHTML = daysLeft + "<small>d </small>" + hoursLeft + "<small>h </small>" + minutesLeft + "<small>m </small>" + secondsLeft + "<small>s</small>";
		// Show link to livestream
		liveStreamLink.classList.remove("hidden");
	}, 1000);
}

// Populates page with upcoming launches
function createUpcomingLaunches(upcomingLaunches) {
	// Check if we have any upcoming launches at all
	if (upcomingLaunches.length <= 0) {
		return;
	}

	// Iterate through at most 6 upcoming launches and generate HTML
	for (var i = 0; i < Math.min(6, upcomingLaunches.length); i++) {
		var launch = upcomingLaunches[i];

		// Create containing element
		var launchContainer = document.createElement("div");
		launchContainer.className = "launch-container";

		// Create date element
		var launchDate = document.createElement("h3");
		launchDate.className = "mb-0";
		// Get launch date in readable format. Removes weekday name.
		launchDate.innerText = utcToLocalTime(launch.launch_date_utc).toDateString().substr(4);
		launchContainer.appendChild(launchDate);

		// Create expander button
		const expander = document.createElement("a");
		expander.className = "expander";
		launchContainer.appendChild(expander);

		// Create Launch Info container
		const launchInfo = document.createElement("div");
		launchInfo.classList.add("launch-info", "hidden");
		launchContainer.appendChild(launchInfo);

		// Create mission container
		var missionContainer = document.createElement("div");
		launchInfo.appendChild(missionContainer);

		// Create mission name label element
		var missionNameLabel = document.createElement("small");
		missionNameLabel.innerText = "MISSION: ";
		missionContainer.appendChild(missionNameLabel);

		// Create mission name element
		var missionName = document.createElement("span");
		missionName.innerText = launch.mission_name;
		missionContainer.appendChild(missionName);

		// Create rocket container
		var rocketContainer = document.createElement("div");
		launchInfo.appendChild(rocketContainer);

		// Create rocket name label element
		var rocketNameLabel = document.createElement("small");
		rocketNameLabel.innerText = "ROCKET: ";
		rocketContainer.appendChild(rocketNameLabel);

		// Create rocket name element
		var rocketName = document.createElement("span");
		rocketName.innerText = launch.rocket.rocket_name;
		rocketContainer.appendChild(rocketName);

		// Create Launch Details link
		var detailsLink = document.createElement("a");
		detailsLink.classList.add("btn", "btn-primary");
		detailsLink.href = "launch.html?id=" + launch.flight_number;
		detailsLink.innerText = "DETAILS";
		launchInfo.appendChild(detailsLink);

		// Append launch container to document
		upcomingLaunchesContainer.appendChild(launchContainer);

		// Expand info on click
		expander.addEventListener("click", function (e) {
			if (launchInfo.classList.contains("hidden")) {
				expander.classList.add("expanded");
				launchInfo.classList.remove("hidden");
			}
			else {
				expander.classList.remove("expanded");
				launchInfo.classList.add("hidden");
			}

			e.stopPropagation();
		});
	}
}

// Populates page with past launches
function createPastLaunches(pastLaunches) {
	// Check if we have any past launches at all
	if (pastLaunches.length <= 0) {
		return;
	}

	// Iterate through at most 6 past launches and generate HTML
	for (var i = 0; i < Math.min(6, pastLaunches.length); i++) {
		var launch = pastLaunches[i];

		// Create containing element
		var launchContainer = document.createElement("div");
		launchContainer.className = "launch-container";

		// Create date element
		var launchDate = document.createElement("h3");
		launchDate.className = "mb-0";
		// Get launch date in readable format. Removes weekday name.
		launchDate.innerText = utcToLocalTime(launch.launch_date_utc).toDateString().substr(4);
		launchContainer.appendChild(launchDate);

		// Create expander button
		const expander = document.createElement("a");
		expander.className = "expander";
		launchContainer.appendChild(expander);

		// Create Launch Info container
		const launchInfo = document.createElement("div");
		launchInfo.classList.add("launch-info", "hidden");
		launchContainer.appendChild(launchInfo);

		// Create mission container
		var missionContainer = document.createElement("div");
		launchInfo.appendChild(missionContainer);

		// Create mission name label element
		var missionNameLabel = document.createElement("small");
		missionNameLabel.innerText = "MISSION: ";
		missionContainer.appendChild(missionNameLabel);

		// Create mission name element
		var missionName = document.createElement("span");
		missionName.innerText = launch.mission_name;
		missionContainer.appendChild(missionName);

		// Create rocket container
		var rocketContainer = document.createElement("div");
		launchInfo.appendChild(rocketContainer);

		// Create rocket name label element
		var rocketNameLabel = document.createElement("small");
		rocketNameLabel.innerText = "ROCKET: ";
		rocketContainer.appendChild(rocketNameLabel);

		// Create rocket name element
		var rocketName = document.createElement("span");
		rocketName.innerText = launch.rocket.rocket_name;
		rocketContainer.appendChild(rocketName);

		// Create Launch Details link
		var detailsLink = document.createElement("a");
		detailsLink.classList.add("btn", "btn-primary");
		detailsLink.href = "launch.html?id=" + launch.flight_number;
		detailsLink.innerText = "DETAILS";
		launchInfo.appendChild(detailsLink);

		// Append launch container to document
		pastLaunchesContainer.appendChild(launchContainer);

		// Expand info on click
		expander.addEventListener("click", function (e) {
			if (launchInfo.classList.contains("hidden")) {
				expander.classList.add("expanded");
				launchInfo.classList.remove("hidden");
			}
			else {
				expander.classList.remove("expanded");
				launchInfo.classList.add("hidden");
			}

			e.stopPropagation();
		});
	}
}

// Sorts launches by time (chronological)
function sortLaunches(launches) {
	launches.sort(function (a, b) {
		return new Date(a.launch_date_utc) - new Date(b.launch_date_utc);
	});

	return launches;
}

// Filters out past launches
function filterDates(launch) {
	return utcToLocalTime(launch.launch_date_utc) < new Date();
}

// Converts UTC time to users local time
function utcToLocalTime(utcTime) {
	return new Date(utcTime);
}