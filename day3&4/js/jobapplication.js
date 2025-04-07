    const form = document.querySelector("form");

    // Regex patterns for validation
    const nameRegex = /^[A-Za-z\s\-]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;

    // Helper functions for showing and clearing errors
    const showError = (inputField, message) => {
        let errorElement = inputField.nextElementSibling;
        if (errorElement && errorElement.classList.contains("error-message")) {
            errorElement.textContent = message;
        }
    };

    const showGroupError = (containerSelector, message) => {
        const container = document.querySelector(containerSelector);
        const errorElement = container.querySelector(".error-message");
        if (errorElement) {
            errorElement.textContent = message;
        }
    };

    const clearError = (inputField) => {
        let errorElement = inputField.nextElementSibling;
        if (errorElement && errorElement.classList.contains("error-message")) {
            errorElement.textContent = "";
        }
    };

    const clearGroupError = (containerSelector) => {
        const container = document.querySelector(containerSelector);
        const errorElement = container.querySelector(".error-message");
        if (errorElement) {
            errorElement.textContent = "";
        }
    };

    // Input restriction helper
    const restrictInvalidChars = (inputField, regex) => {
        inputField.addEventListener("input", () => {
            const cursorPosition = inputField.selectionStart;
            const validValue = inputField.value.split("").filter((char) => regex.test(char)).join("");
            if (inputField.value !== validValue) {
                inputField.value = validValue;
                inputField.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
            }
            clearError(inputField);
        });
    };

    // Get form elements
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    const position = document.getElementById("position");
    const email = document.getElementById("email");
    const mobile = document.getElementById("mobile");
    const dob = document.getElementById("dob");
    const availableFrom = document.getElementById("available-from");
    const anythingField = document.getElementById("message");
    const resume = document.getElementById("resume");

    // Restrict inputs
    restrictInvalidChars(firstName, /^[A-Za-z\s\-]*$/);
    restrictInvalidChars(lastName, /^[A-Za-z\s\-]*$/);

    // Mobile number restriction 
    mobile.addEventListener("input", () => {
        const cursorPosition = mobile.selectionStart;
        let validValue = "";

        for (let i = 0; i < mobile.value.length; i++) {
            const char = mobile.value[i];
            if (i === 0 && /^[6-9]$/.test(char)) {
                validValue += char;
            } else if (i > 0 && /^[0-9]$/.test(char)) {
                validValue += char;
            }
        }

        if (validValue.length > 10) {
            validValue = validValue.substring(0, 10);
        }

        mobile.value = validValue;
        mobile.setSelectionRange(cursorPosition, cursorPosition);
        clearError(mobile);
    });

    // Character limit for "Anything" field
    if (anythingField) {
        anythingField.addEventListener("input", () => {
            if (anythingField.value.length > 250) {
                anythingField.value = anythingField.value.substring(0, 250);
            }
            clearError(anythingField);
        });
    }

    // Blur validation helper
    const validateOnBlur = (inputField, validationFn) => {
        inputField.addEventListener("blur", () => {
            validationFn();
        });
    };

    // Field validations
    const validateFirstName = () => {
        if (!firstName.value.trim()) {
            showError(firstName, "First name is required.");
        } else {
            clearError(firstName);
        }
    };

    const validateLastName = () => {
        if (!lastName.value.trim()) {
            showError(lastName, "Last name is required.");
        } else {
            clearError(lastName);
        }
    };

    const validateEmail = () => {
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            showError(email, "A valid email address is required.");
        } else {
            clearError(email);
        }
    };

    const validateMobile = () => {
        const val = mobile.value.trim();
        if (!val || !mobileRegex.test(val)) {
            showError(mobile, "A valid 10-digit mobile numbero.");
        } else {
            clearError(mobile);
        }
    };

    const validateDOB = () => {
        if (!dob.value.trim()) {
            showError(dob, "Date of birth is required.");
        } else {
            clearError(dob);
        }
    };

    const validatePosition = () => {
        if (!position.value.trim()) {
            showError(position, "Position is required.");
        } else {
            clearError(position);
        }
    };

    const validateAvailableFrom = () => {
        if (!availableFrom.value.trim()) {
            showError(availableFrom, "Available from date is required.");
        } else {
            clearError(availableFrom);
        }
    };

    const validateAnythingField = () => {
        if (!anythingField.value.trim()) {
            showError(anythingField, "This field cannot be empty.");
        } else {
            clearError(anythingField);
        }
    };

    const validateResume = () => {
        if (!resume.files || resume.files.length === 0) {
            showError(resume, "Please upload your resume.");
        } else {
            const allowedExtensions = /(\.pdf|\.doc)$/i;
            if (!allowedExtensions.test(resume.files[0].name)) {
                showError(resume, "Resume must be a PDF or Word document.");
                resume.value = "";
            } else {
                clearError(resume);
            }
        }
    };

    // Apply blur validation
    validateOnBlur(firstName, validateFirstName);
    validateOnBlur(lastName, validateLastName);
    validateOnBlur(email, validateEmail);
    validateOnBlur(mobile, validateMobile);
    validateOnBlur(dob, validateDOB);
    validateOnBlur(position, validatePosition);
    validateOnBlur(availableFrom, validateAvailableFrom);
    validateOnBlur(anythingField, validateAnythingField);
    validateOnBlur(resume, validateResume);

    // Clear group errors on radio selection
    document.querySelectorAll('input[name="gender"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            clearGroupError(".gender-group");
        });
    });

    document.querySelectorAll('input[name="employment-status"]').forEach((radio) => {
        radio.addEventListener("change", () => {
            clearGroupError(".employment-group");
        });
    });

    // Submit handler
    form.addEventListener("submit", (event) => {
        let isValid = true;

        validateFirstName();
        validateLastName();
        validateEmail();
        validateMobile();
        validateDOB();
        validatePosition();
        validateAvailableFrom();
        validateAnythingField();
        validateResume();

        const gender = document.querySelector('input[name="gender"]:checked');
        if (!gender) {
            isValid = false;
            showGroupError(".gender-group", "Please select your gender.");
        } else {
            clearGroupError(".gender-group");
        }

        const employmentStatus = document.querySelector('input[name="employment-status"]:checked');
        if (!employmentStatus) {
            isValid = false;
            showGroupError(".employment-group", "Please select your employment status.");
        } else {
            clearGroupError(".employment-group");
        }

        if (!isValid) {
            event.preventDefault();
        }
    });

