const url = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  fetchData();
  const toggleButton = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  toggleButton.addEventListener("click", function () {
    sidebar.classList.toggle("visible");
    content.classList.toggle("shifted");
  });

  const sendDoubtButton = document.getElementById("send-doubt");
  sendDoubtButton.addEventListener("click", function () {
    sendDoubt();
  });
});

function fetchData() {
  const token = localStorage.getItem("student-token");
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
      const { name, email, hoursUsed, hoursRemaining } = data;
      document.getElementById("sname").innerText = name;
      loadProfileInfo(name, email, hoursUsed, hoursRemaining);
      renderHoursChart(parseFloat(hoursUsed), parseFloat(hoursRemaining));
      loadUpcomingSession();
    })
    .catch((error) => {
      console.error(error);
      transitionToPage("login-signup");
    });
}

function loadProfileInfo(name, email, hoursUsed, hoursRemaining) {
  document.querySelector("#profile-info").innerHTML += `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Hours Used:</strong> ${hoursUsed}</p>
        <p><strong>Hours Remaining:</strong> ${hoursRemaining}</p>
    `;
}

function loadTeacherInfo(tutorName, course) {
  document.getElementById("teacher-photo").src = "../img/icons/tutor.png";
  document.getElementById("teacher-name").innerText = tutorName;
  document.getElementById("teacher-subject").innerText = course;
}

function sendDoubt() {
  const doubtInput = document.getElementById("doubt-input");
  const doubtContent = doubtInput.value.trim();

  if (doubtContent === "") {
    alert("Please enter a doubt.");
    return;
  }

  const chatHistoryContainer = document.getElementById("chat-history");
  const timestamp = new Date().toLocaleString();

  const doubtElement = document.createElement("div");
  doubtElement.classList.add("chat-message", "doubt");
  doubtElement.innerHTML = `
        <p>${doubtContent}</p>
        <span class="timestamp">${timestamp}</span>
    `;

  postDoubt(doubtContent, timestamp);
  chatHistoryContainer.appendChild(doubtElement);
  doubtInput.value = "";

  // reply from teacher !! can change it
  setTimeout(() => {
    const replyElement = document.createElement("div");
    replyElement.classList.add("chat-message", "reply");
    replyElement.innerHTML = `
            <p>Please Give Us Sometime, we will answer your query within 24hours </p>
            <span class="timestamp">${new Date().toLocaleString()}</span>
        `;
    chatHistoryContainer.appendChild(replyElement);
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
  }, 1000);
}

function renderHoursChart(hoursUsed, hoursRemaining) {
  const ctx = document.getElementById("hoursChart").getContext("2d");
  const data = {
    labels: ["Used Hours", "Remaining Hours"],
    datasets: [
      {
        data: [hoursUsed, hoursRemaining],
        backgroundColor: ["#0077a3", "#444"],
        hoverBackgroundColor: ["#005f7a", "#333"],
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };
  const hoursChart = new Chart(ctx, {
    type: "pie",
    data: data,
    options: options,
  });
}

function loadUpcomingSession() {
  const token = localStorage.getItem("student-token");
  fetch(url + "/api/user/student/session-details", {
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
    .then((sessionDetails) => {
      const date = new Date(sessionDetails.date);
      const session = {
        course: sessionDetails.course,
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        teacher: sessionDetails.tutorName,
        link: sessionDetails.sessionLink,
      };

      const sessionContainer = document.querySelector(".session-details");
      sessionContainer.innerHTML = `
        <p><strong>Course:</strong> ${session.course}</p>
        <p><strong>Date (MM/DD/YYYY):</strong> ${session.date}</p>
        <p><strong>Time (HH:MM:SS):</strong> ${session.time}</p>
        <p><strong>Teacher:</strong> ${session.teacher}</p>
        <p><strong>Meeting Link:</strong> ${session.link}</p>
    `;

      loadTeacherInfo(sessionDetails.tutorName, sessionDetails.course);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function postDoubt(doubt, timestamp) {
  const token = localStorage.getItem("student-token");
  fetch(url + "/api/user/post-doubt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      doubt: doubt,
      timestamp: timestamp,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
    });
}

window.transitionToPage = function (href) {
  document.querySelector("body").style.opacity = 0;
  setTimeout(function () {
    window.location.href = url + "/" + href;
  }, 500);
};
