const formName = document.getElementById("inputName");
const formEmail = document.getElementById("inputEmail");
const formMessage = document.getElementById("inputMessage");
const formSuccess = document.getElementById("formSuccess");

// Executes when user clicks submit button
document.getElementById("btnSubmitForm").addEventListener("click", function (e) {
	e.preventDefault();

	// Validate each field
	var isNameValid = validateName();
	var isEmailValid = validateEmail();
	var isMessageValid = validateMessage();

	// Check results and handle success
	if (isNameValid && isEmailValid && isMessageValid) {
		formName.value = "";
		formEmail.value = "";
		formMessage.value = "";
		// Display success message
		formSuccess.classList.remove("hidden");
	}
	else {
		// Hide if already visible
		formSuccess.className = "hidden";
	}

	e.stopPropagation();
});

// Returns true if name is not empty
function validateName() {
	var error = document.getElementById("nameError");

	if (formName.value.length > 0) {
		error.style.display = "none";
		formName.classList.remove("invalid");
		return true;
	}
	else {
		error.style.display = "block";
		formName.classList.add("invalid");
		return false;
	}
}

// Returns true if email matches valid pattern
function validateEmail() {
	var error = document.getElementById("emailError");
	var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	if (formEmail.value.length <= 0) {
		error.style.display = "block";
		formEmail.classList.add("invalid");
		error.innerText = "This field cannot be empty";
		return false;
	}
	else if (!pattern.test(formEmail.value)) {
		error.style.display = "block";
		formEmail.classList.add("invalid");
		error.innerText = "You must provide a valid email address";
		return false;
	}
	else {
		error.style.display = "none";
		formEmail.classList.remove("invalid");
		return true;
	}
}

// Returns true if message is not empty
function validateMessage() {
	var error = document.getElementById("messageError");

	if (formMessage.value.length > 0) {
		error.style.display = "none";
		formMessage.classList.remove("invalid");
		return true;
	}
	else {
		error.style.display = "block";
		formMessage.classList.add("invalid");
		return false;
	}
}