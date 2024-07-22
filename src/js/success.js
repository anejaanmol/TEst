const url = "http://localhost:3000/api/payment/success";

function createConfettiPiece() {
  const confettiPiece = document.createElement("div");
  confettiPiece.classList.add("confetti-piece");
  confettiPiece.style.left = Math.random() * 100 + "vw";
  confettiPiece.style.animationDuration = Math.random() * 2 + 3 + "s";
  confettiPiece.style.backgroundColor = getRandomColor();
  return confettiPiece;
}

function getRandomColor() {
  const colors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function addConfetti() {
  const confettiContainer = document.getElementById("confetti");
  for (let i = 0; i < 100; i++) {
    const confettiPiece = createConfettiPiece();
    confettiContainer.appendChild(confettiPiece);
  }
}

window.onload = addConfetti;

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    hours: params.get("hours"),
    email: params.get("email"),
  };
}

const queryParams = getQueryParams();
const hours = queryParams.hours;
const email = decodeURIComponent(queryParams.email);

const token = localStorage.getItem("token");
fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    email: email,
    hours: hours,
  }),
})
  .then(async (res) => {
    if (res.ok) return res.json();
    return res.json().then((json) => Promise.reject(json));
  })
  .catch((e) => {
    console.log(e);
  });
