function login() {
  const role = document.getElementById("role").value;
  if (!role) return alert("Select role");
  localStorage.setItem("role", role);
  location.href = role + ".html";
}

function checkAuth(role) {
  if (localStorage.getItem("role") !== role)
    location.href = "index.html";
}

function bookAppointment() {
  const subject = document.getElementById("subject").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const withWhom = document.getElementById("with")?.value || "";

  if (!subject || !date || !time) {
    alert("Fill all fields");
    return;
  }

  const notifyAt = new Date(`${date}T${time}`).getTime() - 15 * 60000;

  const data = JSON.parse(localStorage.getItem("appointments")) || [];
  data.push({ subject, date, time, with: withWhom, notifyAt, notified: false });

  localStorage.setItem("appointments", JSON.stringify(data));

  document.getElementById("msg").innerText = "Appointment booked";
  loadCalendarGrid();
  loadReminders();
}

function loadCalendarGrid() {
  const grid = document.getElementById("calendarGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("appointments")) || [];

  for (let i = 1; i <= 30; i++) {
    const d = document.createElement("div");
    d.className = "calendar-day";
    d.innerText = i;

    if (data.some(a => a.date.endsWith(`-${String(i).padStart(2, "0")}`))) {
      d.classList.add("has-event");
    }

    grid.appendChild(d);
  }
}

function toggleReminder() {
  const p = document.getElementById("reminderPanel");
  if (!p) return;
  p.style.display = p.style.display === "block" ? "none" : "block";
}

function loadReminders() {
  const data = JSON.parse(localStorage.getItem("appointments")) || [];

  const bell = document.getElementById("bell-count");
  const panel = document.getElementById("reminderPanel");

  if (!bell || !panel) return;

  bell.innerText = data.length;
  panel.innerHTML = data.map(a =>
    `<p>${a.subject} – ${a.date} ${a.time}</p>`
  ).join("");
}

setInterval(() => {
  const now = Date.now();
  const data = JSON.parse(localStorage.getItem("appointments")) || [];

  data.forEach(a => {
    if (!a.notified && now >= a.notifyAt) {
      alert("🔔 " + a.subject);
      a.notified = true;
    }
  });

  localStorage.setItem("appointments", JSON.stringify(data));
}, 60000);

function approve(btn) {
  btn.parentElement.classList.add("fade-out");
  setTimeout(() => btn.parentElement.innerHTML = "Approved", 300);
}

function reject(btn) {
  btn.parentElement.classList.add("fade-out");
  setTimeout(() => btn.parentElement.innerHTML = "Rejected", 300);
}
