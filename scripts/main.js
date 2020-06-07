var menu = document.getElementById("menu");

// Toggles the mobile menu on click
document.getElementById("btn-nav-toggle").addEventListener("click", function (e) {
	if (menu.classList.contains("open")) {
		menu.classList.remove("open");
	}
	else {
		menu.classList.add("open");
	}

	e.stopPropagation();
});

// Scrolls the window to the given section index in the specified wrapper
function scrollToSection(wrapper, index, scrollTo = "end") {
	document.getElementById(wrapper).children.item(index).scrollIntoView({behavior: "smooth", block: scrollTo});
}