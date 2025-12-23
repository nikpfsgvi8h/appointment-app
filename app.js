function login() {
  const role = document.getElementById("role")?.value;
  if (!role) return alert("Select role");
  localStorage.setItem("role", role);
  location.href = role + ".html";
}

function checkAuth(role) {
  if (localStorage.getItem("role") !== role) {
    location.href = "index.html";
  }
}

function bookAppointment() {
  const subjectEl = document.getElementById("subject");
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("time");
  const withEl = document.getElementById("with");
  const msgEl = document.getElementById("msg");

  if (!subjectEl || !dateEl || !timeEl) return;

  const subject = subjectEl.value;
  const date = dateEl.value;
  const time = timeEl.value;
  const withWhom = withEl ? withEl.value : "";

  if (!subject || !date || !time) {
    alert("Fill all fields");
    return;
  }

  const notifyAt = new Date(`${date}T${time}`).getTime() - 15 * 60000;

  const data = JSON.parse(localStorage.getItem("appointments")) || [];
  data.push({
    subject,
    date,
    time,
    with: withWhom,
    notifyAt,
    notified: false
  });

  localStorage.setItem("appointments", JSON.stringify(data));

  if (msgEl) msgEl.innerText = "Appointment booked";
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

    if (data.some(a => a.date?.endsWith(`-${String(i).padStart(2, "0")}`))) {
      d.classList.add("has-event");
    }

    grid.appendChild(d);
  }
}

function toggleReminder() {
  const panel = document.getElementById("reminderPanel");
  if (!panel) return;

  panel.style.display =
    panel.style.display === "block" ? "none" : "block";
}

function loadReminders() {
  const panel = document.getElementById("reminderPanel");
  const countEl = document.getElementById("bellCount");
  if (!panel) return;

  const data = JSON.parse(localStorage.getItem("appointments")) || [];

  if (countEl) countEl.innerText = data.length;

  panel.innerHTML = data
    .map(a => `<p>${a.subject} – ${a.time}</p>`)
    .join("");
}

setInterval(() => {
  const now = Date.now();
  const data = JSON.parse(localStorage.getItem("appointments")) || [];
  let changed = false;

  data.forEach(a => {
    if (!a.notified && now >= a.notifyAt) {
      alert("🔔 " + a.subject);
      a.notified = true;
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem("appointments", JSON.stringify(data));
  }
}, 60000);

function approve(btn) {
  if (!btn) return;
  const parent = btn.parentElement;
  parent.classList.add("fade-out");
  setTimeout(() => (parent.innerHTML = "Approved"), 300);
}

function reject(btn) {
  if (!btn) return;
  const parent = btn.parentElement;
  parent.classList.add("fade-out");
  setTimeout(() => (parent.innerHTML = "Rejected"), 300);
}
