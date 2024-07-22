const url = "http://localhost:3000";

function showRegistration() {
  document.getElementById("registrationForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";
  moveSlider("registrationBtn");
}

function showLogin() {
  document.getElementById("registrationForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  moveSlider("loginBtn");
}

function showTeacherForm() {
  document.getElementById("teacherForm").style.display = "block";
  document.getElementById("studentForm").style.display = "none";
  document.getElementById("teacherBtn").style.backgroundColor = "#1E88E5";
  document.getElementById("studentBtn").style.backgroundColor = "#808080";
}

function showStudentForm() {
  document.getElementById("teacherForm").style.display = "none";
  document.getElementById("studentForm").style.display = "block";
  document.getElementById("studentBtn").style.backgroundColor = "#1E88E5";
  document.getElementById("teacherBtn").style.backgroundColor = "#808080";
}

function sendOtp(emailFieldId) {
  const email = document.getElementById(emailFieldId).value.trim();
  console.log(email);
  if (email) {
    const data = {
      email: email,
    };

    fetch(`${url}/api/user/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert("OTP Sent successfully! Please check your mail");
      })
      .catch((error) => {
        alert(error);
      });
  } else {
    alert("Please enter a valid email address.");
  }
}

function moveSlider(buttonId) {
  const button = document.getElementById(buttonId);
  const slider = document.getElementById("slider");
  slider.style.left = button.offsetLeft + "px";
  slider.style.width = button.offsetWidth + "px";
}

function registerUser(event, isTutor) {
  event.preventDefault();
  const formId = isTutor ? "teacherForm" : "studentForm";
  const form = document.getElementById(formId);
  const formData = new FormData(form);

  if (formData.get("password") !== formData.get("repassword")) {
    alert("Password Mismatched");
    return;
  }

  const jsonData = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    password: formData.get("password"),
    otp: formData.get("otp").trim(),
    isTutor: isTutor,
  };

  fetch(`${url}/api/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message);
        });
      }
      return response.json();
    })
    .then((data) => {
      alert("[+] Registration Successful! [+]");
      showLogin();
    })
    .catch((error) => {
      alert(error);
    });
}

function loginUser(event) {
  event.preventDefault();
  const formId = "login-form-selector";
  const form = document.getElementById(formId);
  const formData = new FormData(form);

  const jsonData = {
    email: formData.get("email").trim(),
    password: formData.get("password"),
  };

  fetch(`${url}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message);
        });
      }
      return response.json();
    })
    .then((data) => {
      const { accessToken, isTutor } = data;
      const href = isTutor ? "tutor" : "student";
      const key = isTutor ? "tutor-token" : "student-token";
      localStorage.setItem(key, accessToken);
      transitionToPage(href);
    })
    .catch((error) => {
      alert(error);
    });
}

function resetBtn(event) {
  event.preventDefault();
  const form = document.getElementById("resetForm");
  const formData = new FormData(form);

  if (formData.get("newPassword") !== formData.get("confirmNewPassword")) {
    alert("Password Mismatched");
    return;
  }

  const jsonData = {
    email: formData.get("email").trim(),
    newPassword: formData.get("newPassword"),
    otp: formData.get("otp"),
  };

  fetch(`${url}/api/user/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then(async (response) => {
      if (!response.ok) {
        return response.json().then((err) => {
          throw new Error(err.message);
        });
      }
      return response.json();
    })
    .then((data) => {
      alert("Password Changed Successfully");
      transitionToPage("login-signup");
    })
    .catch((error) => {
      alert(error);
    });
}

window.transitionToPage = function (href) {
  document.querySelector("body").style.opacity = 0;
  setTimeout(function () {
    window.location.href = url + "/" + href;
  }, 500);
};
