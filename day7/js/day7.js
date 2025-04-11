const form = document.querySelector("form");
const charCounter = document.querySelector(".char-counter");

// inputs 
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
  employment: "employment-status",
};

// Restrict name fields – no numbers 
["firstName", "lastName"].forEach(key => {
  inputs[key].addEventListener("input", () => {
    inputs[key].value = inputs[key].value.replace(/[^A-Za-z\s]/g, "");
  });
});

// Mobile number logic: must start with 6–9 and be 10 digits
inputs.mobile.addEventListener("input", () => {
  let num = inputs.mobile.value.replace(/\D/g, "");
  if (num.length > 0 && !/^[6-9]/.test(num)) {
    num = num.slice(1); // chuck out wrong starting digit
  }
  inputs.mobile.value = num.slice(0, 10);
});

// Max DOB: make sure user is 18+
const getMinDob = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

const updateMaxDate = () => {
  const min = getMinDob();
  inputs.dob.setAttribute("max", min.toISOString().split("T")[0]);
};

updateMaxDate(); // run on load

// Schedule to re-run it 
setInterval(() => {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  setTimeout(updateMaxDate, nextMidnight - now);
}, 86400000); // 24h

// Validators
const validators = {
  firstName: val => /^[A-Za-z\s]+$/.test(val),
  lastName: val => /^[A-Za-z\s]+$/.test(val),
  email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  mobile: val => /^[6-9][0-9]{9}$/.test(val),
  position: val => val !== "",
  resume: file => file && /\.(pdf|doc)$/i.test(file.name),
  message: val => val.length <= 250 && val.trim() !== "",
  dob: val => {
    const date = new Date(val);
    return date <= getMinDob();
  },
  availableFrom: val => val !== ""
};

// Show validation feedback
function setValidity(input, valid, msg = "") {
  const error = input.nextElementSibling;
  input.classList.remove("is-valid", "is-invalid");
  if (valid) {
    input.classList.add("is-valid");
    if (error) error.textContent = "";
  } else {
    input.classList.add("is-invalid");
    if (error) error.textContent = msg;
  }
}

// Per-field check
function validateField(key) {
  const input = inputs[key];
  if (key === "resume") {
    const file = input.files[0];
    const valid = validators.resume(file);
    setValidity(input, valid, "Only .pdf or .doc files, please.");
    return valid;
  } else {
    const value = input.value.trim();
    const valid = validators[key](value);
    const msgs = {
      firstName: "Only letters allowed.",
      lastName: "Only letters allowed.",
      email: "Invalid email address.",
      mobile: "Mobile must start with 6-9 and have 10 digits.",
      position: "Pick a position.",
      dob: "You must be 18+.",
      availableFrom: "Give us a date!",
      message: "Max 250 characters, no empty messages."
    };
    setValidity(input, valid, msgs[key]);
    return valid;
  }
}

// Radio validation
function validateRadio(name, containerClass) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  const container = document.querySelector(containerClass);
  const error = container.querySelector(".error-message");
  if (!selected) {
    error.textContent = "Please choose one.";
    return false;
  }
  error.textContent = "";
  return true;
}

// Real-time events
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

// Resume file change trigger
inputs.resume.addEventListener("change", () => validateField("resume"));

// Radio click clears error
["gender", "employment-status"].forEach(name => {
  document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
    radio.addEventListener("change", () => {
      const cls = name === "gender" ? ".gender-group" : ".employment-group";
      const err = document.querySelector(`${cls} .error-message`);
      err.textContent = "";
    });
  });
});

// Submit check – final gatekeeper
form.addEventListener("submit", (e) => {
  let okay = true;
  Object.keys(inputs).forEach(key => {
    if (!validateField(key)) okay = false;
  });

  if (!validateRadio("gender", ".gender-group")) okay = false;
  if (!validateRadio("employment-status", ".employment-group")) okay = false;

  if (!okay) {
    e.preventDefault();
    const firstBad = document.querySelector(".is-invalid");
    if (firstBad) {
      firstBad.focus();
      firstBad.scrollIntoView({ behavior: "smooth" });
    }
  }
});
