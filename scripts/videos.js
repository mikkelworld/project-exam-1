const videoPlayer = document.getElementById("videoplayer");
const videoLibWrapper = document.getElementById("video-library-wrapper");

const videoTitle = document.getElementById("video-title");
const videoAuthor = document.getElementById("video-author");
const videoDescription = document.getElementById("video-description");

// Get videos from external file
fetch('http://www.mikkelworld.com/courses/project-exam-1/fp/data/videos.json')
	.then(result => {
		return result.json();
	})
	.then(json => {
		createLibrary(json);
	})
	.catch(err => {
		console.log(err)
	});

// Populates video list/grid with videos from json file
function createLibrary(videos) {
	// Iterate over all videos
	videos.forEach(video => {
		// Create clickable wrapper
		const videoItem = document.createElement("a");
		videoItem.id = video.videoID;
		videoItem.href = "#";
		videoItem.className = "video-item";

		// Add click event to change video
		videoItem.addEventListener("click", function(e) {
			e.preventDefault();
			// Play this video
			selectVideo(video);
			
			e.stopPropagation();
		});

		// Create image (pull from youtube thumbnail)
		var videoImg = document.createElement("img");
		videoImg.src = `https://img.youtube.com/vi/${video.videoID}/0.jpg`;
		videoItem.appendChild(videoImg);

		// Create video name
		var videoName = document.createElement("span");
		videoName.className = "video-title";
		videoName.innerText = video.name;
		videoItem.appendChild(videoName);

		// Append item to list/grid
		videoLibWrapper.appendChild(videoItem);
	});

	selectVideo(videos[0]);
}

// Selects a new video to play
function selectVideo(video) {
	// Remove iframe
	videoPlayer.innerHTML = "";

	// Remove indication of currently playing video
	var playing = document.getElementsByClassName("playing");
	if (playing.length > 0)
		playing[0].classList.remove("playing");
	
	// Make new iframe
	var iframe = document.createElement("iframe");
	iframe.src = "https://www.youtube.com/embed/" + video.videoID;
	videoPlayer.appendChild(iframe);

	// Set video meta
	videoTitle.innerText = video.name;
	videoAuthor.innerText = video.author;
	videoDescription.innerText = video.description;

	// Scroll up for better UX
	scrollToSection("videos", 0);

	// Add class to indicate currently playing video
	document.getElementById(video.videoID).classList.add("playing");
}