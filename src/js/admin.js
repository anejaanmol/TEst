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

  const courses = [];
  const assignments = [];

  //  courses section
  const coursesList = document.querySelector(".courses-list");
  courses.forEach((course) => {
    const courseItem = document.createElement("div");
    courseItem.classList.add("course-item");
    courseItem.innerHTML = `
            <h3>${course.name}</h3>
            <p>Students Enrolled: ${course.studentsEnrolled}</p>
        `;
    coursesList.appendChild(courseItem);
  });

  //  assignments section
  const assignmentsList = document.querySelector(".assignments-list");
  assignments.forEach((assignment) => {
    const assignmentItem = document.createElement("div");
    assignmentItem.classList.add("assignment-item");
    assignmentItem.innerHTML = `
            <h3>${assignment.title}</h3>
            <p>${assignment.description}</p>
            <p>Status: ${assignment.status}</p>
        `;
    assignmentsList.appendChild(assignmentItem);
  });
});

function fetchData() {
  const token = localStorage.getItem("admin-token");
  fetch(url + "/api/admin/data", {
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
      const { name, students, tutors, sessions, doubts } = data;
      console.log(doubts);
      document.getElementById("aname").innerText = name;
      loadStudents(students);
      loadTeachers(tutors);
      loadSessions(sessions);
      loadDoubts(doubts.reverse());
      loadCountChart(students.length, tutors.length, 0);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function loadStudents(students) {
  const studentsList = document.querySelector(".students-list");
  students.forEach((student) => {
    const studentItem = document.createElement("div");
    studentItem.classList.add("student-item");
    studentItem.innerHTML = `
            <h3>${student.name}</h3>
            <p>Email: ${student.email}</p>
            <p>Hours Remaining: ${student.hoursRemaining}</p>
        `;
    studentsList.appendChild(studentItem);
  });
}

function loadTeachers(teachers) {
  const teachersList = document.querySelector(".teachers-list");
  teachers.forEach((teacher) => {
    const teacherItem = document.createElement("div");
    teacherItem.classList.add("teacher-item");
    teacherItem.innerHTML = `
            <h3>${teacher.name}</h3>
            <p>Email: ${teacher.email}</p>
            <p>Hours Taught: ${teacher.hoursCredited}</p>
        `;
    teachersList.appendChild(teacherItem);
  });
}

function loadCountChart(studentCount, teacherCount, courseCount) {
  const ctx = document.getElementById("overviewChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Students", "Teachers", "Courses"],
      datasets: [
        {
          label: "Overview",
          data: [studentCount, teacherCount, courseCount],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function loadSessions(sessions) {
  const sessionsList = document.querySelector(".sessions-list");
  sessions.forEach((session) => {
    const date = new Date(session.date);
    const sessionItem = document.createElement("div");
    sessionItem.classList.add("teacher-item");
    sessionItem.innerHTML = `
            <p>Student Name: ${session.studentName}</p>
            <p>Student Email: ${session.studentEmail}</p>
            <p>Teacher Name: ${session.tutorName}</p>
            <p>Teacher Email: ${session.tutorEmail}</p>
            <p>Course: ${session.course}</p>
            <p>Date: ${date.toLocaleDateString()}</p>
            <p>Time: ${date.toLocaleTimeString()}</p>
            <p>Link: <a>${session.sessionLink}</a> </p>
        `;
    sessionsList.appendChild(sessionItem);
  });
}

function scheduleSession(event) {
  event.preventDefault();
  const formId = "scheduleSessionForm";
  const form = document.getElementById(formId);
  const formData = new FormData(form);

  const jsonData = {
    studentEmail: formData.get("student-email").trim(),
    tutorEmail: formData.get("teacher-email"),
    course: formData.get("course"),
    date: new Date(
      formData.get("session-date") + "T" + formData.get("session-time")
    ),
    sessionLink: formData.get("session-link"),
  };
  console.log(jsonData);

  const token = localStorage.getItem("admin-token");
  fetch(`${url}/api/admin/schedule-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer: ${token}`,
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
      alert(data.message);
      location.reload();
    })
    .catch((error) => {
      alert(error);
    });
}

function performTranscation(event) {
  event.preventDefault();
  const formId = "transaction";
  const form = document.getElementById(formId);
  const formData = new FormData(form);

  const jsonData = {
    studentEmail: formData.get("student-email").trim(),
    tutorEmail: formData.get("teacher-email"),
    hours: formData.get("session-time"),
  };
  console.log(jsonData);

  const token = localStorage.getItem("admin-token");
  fetch(`${url}/api/admin/transact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer: ${token}`,
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
      alert(data.message);
      location.reload();
    })
    .catch((error) => {
      alert(error);
    });
}

function loadDoubts(doubts) {
  const doubtsList = document.querySelector(".doubts-list");
  doubts.forEach((doubt) => {
    const doubtItem = document.createElement("div");
    doubtItem.classList.add("doubt-item");
    doubtItem.innerHTML = `
            <h3>${doubt.studentEmail}</h3>
            <p>Doubt: ${doubt.doubt}</p>
            <span class="timestamp">${doubt.timestamp}</span>
        `;
    doubtsList.appendChild(doubtItem);
  });
}
