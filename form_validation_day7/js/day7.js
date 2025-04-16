$(document).ready(function () {
  const form = $("form");
  const charCounter = $(".char-counter");

  const inputs = {
    firstName: $("#first-name")[0],
    lastName: $("#last-name")[0],
    dob: $("#dob")[0],
    email: $("#email")[0],
    mobile: $("#mobile")[0],
    position: $("#position")[0],
    availableFrom: $("#available-from")[0],
    message: $("#message")[0],
    resume: $("#resume")[0],
  };

  const getMinDob = () => {
    const today = new Date();
    return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  };

  const updateMaxDate = () => {
    const min = getMinDob();
    $(inputs.dob).attr("max", min.toISOString().split("T")[0]);
  };

  updateMaxDate();
  setInterval(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    setTimeout(updateMaxDate, nextMidnight - now);
  }, 86400000);

  // Name field restrictions
  ["firstName", "lastName"].forEach(key => {
    $(inputs[key]).on("input", function () {
      this.value = this.value.replace(/[^A-Za-z\s]/g, "");
    });
  });

  // Mobile number formatting
  $(inputs.mobile).on("input", function () {
    let num = this.value.replace(/\D/g, "");
    if (num.length > 0 && !/^[6-9]/.test(num)) {
      num = num.slice(1);
    }
    this.value = num.slice(0, 10);
  });

  const validators = {
    firstName: val => /^[A-Za-z\s]+$/.test(val),
    lastName: val => /^[A-Za-z\s]+$/.test(val),
    email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    mobile: val => /^[6-9][0-9]{9}$/.test(val),
    position: val => val !== "",
    resume: file => file && /\.(pdf|doc)$/i.test(file.name),
    message: val => val.length <= 250,
    dob: val => new Date(val) <= getMinDob(),
    availableFrom: val => val !== ""
  };

  function setValidity(input, valid, msg = "") {
    const $input = $(input);
    const $error = $input.next();
    if (input === inputs.message && input.value.trim() === "") {
      $input.removeClass("is-valid is-invalid");
      $error.text("");
      return;
    }
    $input.removeClass("is-valid is-invalid");
    if (valid) {
      $input.addClass("is-valid");
      $error.text("");
    } else {
      $input.addClass("is-invalid");
      $error.text(msg);
    }
  }

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
        dob: "You must be at least 18 years old.",
        lastName: "Only letters allowed.",
        email: "Invalid email address.",
        mobile: "Mobile must start with 6-9 and have 10 digits.",
        position: "Pick a position.",
        dob: "You must be 18+.",
        availableFrom: "Give us a date!",
        message: "Max 250 characters."
      };
      setValidity(input, valid, msgs[key]);
      return valid;
    }
  }

  function validateRadio(name, containerClass) {
    const selected = $(`input[name="${name}"]:checked`);
    const $container = $(containerClass);
    const $error = $container.find(".error-message");
    if (selected.length === 0) {
      $error.text("Please choose one.");
      return false;
    }
    $error.text("");
    return true;
  }

  Object.keys(inputs).forEach(key => {
    if (!inputs[key]) {
      console.error(`Input element for key "${key}" is not defined.`);
      return;
    }
    const $input = $(inputs[key]);
    $input.on("blur", () => validateField(key));
    if (key === "message") {
      $input.on("input", function () {
        charCounter.text(`${this.value.length}/250`);
        if (this.value.length > 250) {
          this.value = this.value.slice(0, 250);
        }
      });
    }
  });

  $(inputs.resume).on("change", () => validateField("resume"));

  ["gender", "employment-status"].forEach(name => {
    $(`input[name="${name}"]`).on("change", function () {
      const cls = name === "gender" ? ".gender-group" : ".employment-group";
      $(`${cls} .error-message`).text("");
    });
  });

  form.on("submit", function (e) {
    let okay = true;
    Object.keys(inputs).forEach(key => {
      if (!validateField(key)) okay = false;
    });

    if (!validateRadio("gender", ".gender-group")) okay = false;
    if (!validateRadio("employment-status", ".employment-group")) okay = false;

    if (!okay) {
      e.preventDefault();
      const $firstBad = $(".is-invalid").first();
      if ($firstBad.length) {
        $firstBad.focus()[0].scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});
