const url = "http://localhost:3000/api/payment/checkout";

function handlePlanClick(planId) {
  const token = localStorage.getItem("token");
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: [{ id: planId }],
    }),
  })
    .then(async (res) => {
      if (res.ok) return res.json();
      return res.json().then((json) => Promise.reject(json));
    })
    .then((data) => {
      const { url, accessToken } = data;
      localStorage.setItem("token", accessToken);
      window.location = url;
    })
    .catch((e) => {
      alert(`[+] Error: ${e.message} [+]`)
    });
}
