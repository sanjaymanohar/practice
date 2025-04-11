
    const form = document.querySelector("form");
    const charCounter = document.querySelector(".char-counter");
  
    const inputs = {
      firstName: document.getElementById("first-name"),
      lastName: document.getElementById("last-name"),
      dob: document.getElementById("dob"),
      email: document.getElementById("email"),
      mobile: document.getElementById("mobile"),
      position: document.getElementById("position"),
      availableFrom: document.getElementById("available-from"),
      message: document.getElementById("message"),
      resume: document.getElementById("resume"),
    };
  
    const radioGroups = {
      gender: "gender",
      employment: "employment-status"
    };
  
    // Restrict name inputs to letters only
    ["firstName", "lastName"].forEach(key => {
      inputs[key].addEventListener("input", () => {
        inputs[key].value = inputs[key].value.replace(/[^A-Za-z\s\-]/g, "");
      });
    });
  
    // Restrict mobile input to start with 6
    inputs.mobile.addEventListener("input", () => {
      let value = inputs.mobile.value.replace(/[^0-9]/g, "");
      if (value.length > 0 && !/^[6-9]/.test(value)) {
        value = value.slice(1); // Remove invalid starting digit
      }
      inputs.mobile.value = value.slice(0, 10); // Limit to 10 digits
    });
  
    const validators = {
      firstName: val => /^[A-Za-z\s\-]+$/.test(val),
      lastName: val => /^[A-Za-z\s\-]+$/.test(val),
      email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      mobile: val => /^[6-9][0-9]{9}$/.test(val),
      position: val => val !== "",
      resume: file => /\.(pdf|doc)$/i.test(file.name),
      message: val => val.length <= 250 && val.trim() !== "",
      dob: val => val !== "",
      availableFrom: val => val !== ""
    };
  
    const setValidity = (input, valid, message = "") => {
      const errorElement = input.nextElementSibling;
      input.classList.remove("is-valid", "is-invalid");
      if (valid) {
        input.classList.add("is-valid");
        errorElement.textContent = "";
      } else {
        input.classList.add("is-invalid");
        errorElement.textContent = message;
      }
    };
  
    const validateField = (key) => {
      const input = inputs[key];
      if (key === "resume") {
        const file = input.files[0];
        const valid = file && validators.resume(file);
        setValidity(input, valid, "Only .pdf or .doc files are allowed.");
        return valid;
      } else {
        const valid = validators[key](input.value.trim());
        const messages = {
          firstName: "First name is required.",
          lastName: "Last name is required.",
          email: "Enter a valid email address.",
          mobile: "Enter a valid 10-digit mobile number starting with 6 and above.",
          position: "Please select a position.",
          dob: "Date of birth is required.",
          availableFrom: "Please provide an availability date.",
          message: "Message is required and must be under 250 characters."
        };
        setValidity(input, valid, messages[key]);
        return valid;
      }
    };
  
    const validateRadioGroup = (name, containerClass) => {
      const selected = document.querySelector(`input[name="${name}"]:checked`);
      const container = document.querySelector(containerClass);
      const errorElement = container.querySelector(".error-message");
      if (!selected) {
        errorElement.textContent = "This field is required.";
        return false;
      }
      errorElement.textContent = "";
      return true;
    };
  
    // Attach input/blur events
    Object.keys(inputs).forEach(key => {
      const input = inputs[key];
      input.addEventListener("blur", () => validateField(key));
      if (key === "message") {
        input.addEventListener("input", () => {
          charCounter.textContent = `${input.value.length}/250`;
          if (input.value.length > 250) {
            input.value = input.value.slice(0, 250);
          }
        });
      }
    });
  
    // Mobile input restriction
    inputs.mobile.addEventListener("input", () => {
      inputs.mobile.value = inputs.mobile.value.replace(/[^0-9]/g, "").slice(0, 10);
    });
  
    // Resume validation on change
    inputs.resume.addEventListener("change", () => validateField("resume"));
  
    // Radio change clear error
    ["gender", "employment-status"].forEach(name => {
      document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
        radio.addEventListener("change", () => {
          const groupClass = name === "gender" ? ".gender-group" : ".employment-group";
          const errorElement = document.querySelector(groupClass + " .error-message");
          errorElement.textContent = "";
        });
      });
    });
  
    // On form submit
    form.addEventListener("submit", (e) => {
      let isValid = true;
  
      Object.keys(inputs).forEach(key => {
        if (!validateField(key)) isValid = false;
      });
  
      if (!validateRadioGroup("gender", ".gender-group")) isValid = false;
      if (!validateRadioGroup("employment-status", ".employment-group")) isValid = false;
  
      if (!isValid) {
        e.preventDefault();
        const firstError = document.querySelector(".is-invalid");
        if (firstError) firstError.focus();
        if (firstError) firstError.scrollIntoView({ behavior: "smooth" });
      }
    });
 
  