const liveStreamLink = document.getElementById("btnLivestream");

const pageTitle = document.getElementById("page-title");
const pageDescription = document.getElementById("page-description");
const btnReturn = document.getElementById("btnReturn");

const launchDetailsWrapper = document.getElementById("launch-details-wrapper");

// Get query string from URL
function getQueryStringValue(key) {
	return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

const id = getQueryStringValue("id");

if (id === "") {
	pageTitle.innerText = "No flight ID provided";
	pageDescription.innerText = "Please return to the launches page and choose a lanch";
	btnReturn.classList.remove("hidden");
}
else {
	// Gets past launches from SpaceX API
	fetch("https://api.spacexdata.com/v3/launches/" + id)
		.then(data => {
			return data.json();
		})
		.then(json => {
			createFlightDetailsPage(json);
		})
		.catch(error => {
			console.log("Unable to get launch data: " + error);
			pageTitle.innerText = "Unable to get launch data";
			pageDescription.innerText = "Please try again later, or choose another launch";
			btnReturn.classList.remove("hidden");
		});
}

// Populates page with flight details
function createFlightDetailsPage(launch) {
	pageTitle.innerText = launch.mission_name;
	pageDescription.innerText = utcToLocalTime(launch.launch_date_utc).toDateString() + " - " + utcToLocalTime(launch.launch_date_utc).toLocaleTimeString();

	var isPastLaunch = !launch.upcoming;

	// Mission details
	var firstSection = createSection();
	launchDetailsWrapper.appendChild(firstSection);

	// Add image if one exists
	if (launch.links.mission_patch != null) {
		var missionPatch = document.createElement("img");
		missionPatch.src = launch.links.mission_patch;
		firstSection.appendChild(missionPatch);
	}

	// Add mission details if it exists
	if (launch.details != null) {
		var descriptionWrapper = document.createElement("div");
		firstSection.appendChild(descriptionWrapper);

		var detailsHeader = document.createElement("h3");
		detailsHeader.innerText = "Mission details";
		descriptionWrapper.appendChild(detailsHeader);
	
		var launchDescription = document.createElement("p");
		launchDescription.innerText = launch.details;
		descriptionWrapper.appendChild(launchDescription);
	}	

	// Rocket details
	var secondSection = createSection();
	launchDetailsWrapper.appendChild(secondSection);

	var rocketHeader = document.createElement("h3");
	rocketHeader.innerText = "Rocket";
	secondSection.appendChild(rocketHeader);

	secondSection.appendChild(createKeyValElement("Rocket type:", launch.rocket.rocket_name));

	if (isPastLaunch)
		secondSection.appendChild(createKeyValElement("Launch successful:", launch.launch_success ? "Yes" : "No"));

	if (launch.rocket.first_stage.cores[0].reused != null)
		secondSection.appendChild(createKeyValElement("First stage reused:", launch.rocket.first_stage.cores[0].reused ? "Yes" : "No"));

	if (launch.rocket.first_stage.cores[0].landing_intent != null)
		secondSection.appendChild(createKeyValElement("Will attempt to land:", launch.rocket.first_stage.cores[0].landing_intent ? "Yes" : "No"));

	if (isPastLaunch)
		secondSection.appendChild(createKeyValElement("Landing successful:", launch.rocket.first_stage.cores[0].land_success ? "Yes" : "No"));

	// Launch site
	var thirdSection = createSection();
	launchDetailsWrapper.appendChild(thirdSection);

	var otherHeader = document.createElement("h3");
	otherHeader.innerText = "Other";
	thirdSection.appendChild(otherHeader);

	thirdSection.appendChild(createKeyValElement("Launch site:", launch.launch_site.site_name));
	thirdSection.appendChild(createKeyValElement("Crew:", launch.crew != null ? "Yes" : "No"));
	thirdSection.appendChild(createKeyValElement("Main payload type:", launch.rocket.second_stage.payloads[0].payload_type));
	thirdSection.appendChild(createKeyValElement("Customer:", launch.rocket.second_stage.payloads[0].customers[0]));
	thirdSection.appendChild(createKeyValElement("Nationality:", launch.rocket.second_stage.payloads[0].nationality));

	// Embed Youtube video if it exists
	if (launch.links.youtube_id != null) {
		// Rocket details
		var fourthSection = createSection();
		fourthSection.id = "video";
		launchDetailsWrapper.appendChild(fourthSection);

		var videoLabel = document.createElement("h3");
		videoLabel.innerText = "Video";
		fourthSection.appendChild(videoLabel);

		var videoplayer = document.createElement("div");
		videoplayer.id = "videoplayer";
		fourthSection.appendChild(videoplayer);

		var video = document.createElement("iframe");
		video.id = "video-iframe";
		video.src = "https://www.youtube.com/embed/" + launch.links.youtube_id;
		videoplayer.appendChild(video);
	}
}

// Helper function to generate HTML elements
function createKeyValElement(key, value) {
	var wrapper = document.createElement("div");
	wrapper.className = "kv-wrapper";

	var keyElem = document.createElement("span");
	keyElem.className = "kv-key";
	keyElem.innerText = key;
	wrapper.appendChild(keyElem);

	var valElem = document.createElement("span");
	valElem.className = "kv-val";
	valElem.innerText = value;
	wrapper.appendChild(valElem);

	return wrapper;
}

// Helper function
function createSection() {
	return document.createElement("section");
}

// Converts UTC time to users local time
function utcToLocalTime(utcTime) {
	return new Date(utcTime);
}