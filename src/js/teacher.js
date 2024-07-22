const url = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
  const toggleSidebarBtn = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");

  toggleSidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("visible");
    content.classList.toggle("shifted");
  });
});

function fetchData() {
  const token = localStorage.getItem("tutor-token");
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
      const { name, email, hoursCredited } = data;
      document.getElementById("tname").innerText = name;
      document.getElementById("teacher-name").innerText = name;
      document.getElementById("teacher-email").innerText = email;
      document.getElementById("teacher-hours").innerText = hoursCredited;
      loadUpcomingSession();
      loadHoursChart(hoursCredited);
    })
    .catch((error) => {
      console.error(error);
      transitionToPage("login-signup");
    });
}

function loadHoursChart(hoursTaught) {
  const ctx = document.getElementById("hoursChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Total Hours Taught"],
      datasets: [
        {
          label: "Total Hours Taught",
          data: [hoursTaught],
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
    },
  });
}

function loadUpcomingSession() {
  const token = localStorage.getItem("tutor-token");
  fetch(url + "/api/user/tutor/session-details", {
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
        student: sessionDetails.studentName,
        link: sessionDetails.sessionLink,
      };

      const sessionContainer = document.querySelector(".session-details");
      sessionContainer.innerHTML = `
          <p><strong>Course:</strong> ${session.course}</p>
          <p><strong>Date (MM/DD/YYYY):</strong> ${session.date}</p>
          <p><strong>Time (HH:MM:SS):</strong> ${session.time}</p>
          <p><strong>Student:</strong> ${session.student}</p>
          <p><strong>Meeting Link:</strong> ${session.link}</p>
      `;
      loadStudentData(session.student, session.course);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function loadStudentData(name, course) {
  const studentsList = document.querySelector(".students-list");
  const studentItem = document.createElement("div");
  studentItem.classList.add("student-item");
  studentItem.innerHTML = `<h3>${name}</h3><p>${course}</p>`;
  studentsList.appendChild(studentItem);
}

window.transitionToPage = function (href) {
  document.querySelector("body").style.opacity = 0;
  setTimeout(function () {
    window.location.href = url + "/" + href;
  }, 500);
};
