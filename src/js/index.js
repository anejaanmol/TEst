const url = "http://localhost:3000";

function scrollToSection(sectionId) {
  document.querySelector(sectionId).scrollIntoView({
    behavior: "smooth",
  });
}

function showTab(event) {
  event.preventDefault();
  var signInBox = document.getElementById("signInBox");
  var signInLink = document.getElementById("signInLink");
  var rect = signInLink.getBoundingClientRect();
  signInBox.style.top = rect.bottom + "px";
  signInBox.style.left = rect.left + "px";

  if (signInBox.classList.contains("hidden")) {
    signInBox.classList.remove("hidden");
  } else {
    signInBox.classList.add("hidden");
  }
}

function fetchData() {
  const token = localStorage.getItem("token");
  fetch(url + "/api/user/current", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      var spanElement = document.getElementById("content");
      var plan = document.getElementById("plan");
      if (plan && data.isTutor) {
        plan.remove();
      }
      var dashboard = document.getElementById("dashboard");
      var page = "student";
      if (data.isTutor) {
        page = "tutor";
      }
      dashboard.addEventListener("click", function () {
        transitionToPage(page);
      });

      var htmlContent = `<li><a id="signInLink" onclick="showTab(event)"><img src='../img/icons/user.png' height=30 width=30></a></li>`;
      spanElement.innerHTML = htmlContent;
      var signInMessage = document.getElementById("signInMessage");
      signInMessage.textContent = `Welcome ${data.name}`;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function logOut() {
  localStorage.setItem("token", null);
  location.reload();
}

document.querySelectorAll("a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const sectionId = this.getAttribute("href");
    scrollToSection(sectionId);
  });
});

window.transitionToPage = function (href) {
  document.querySelector("body").style.opacity = 0;
  setTimeout(function () {
    window.location.href = url + "/" + href;
  }, 500);
};

document.addEventListener("DOMContentLoaded", function (event) {
  fetchData();
  document.querySelector("body").style.opacity = 1;
});
