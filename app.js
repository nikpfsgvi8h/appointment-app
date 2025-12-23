/* ========= AUTH ========= */

function login() {
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;

  if (!email || !role) {
    alert("Enter email and select role");
    return;
  }

  localStorage.setItem("email", email);
  localStorage.setItem("role", role);
  location.href = role + ".html";
}

function checkAuth(role) {
  if (localStorage.getItem("role") !== role) {
    location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  location.href = "index.html";
}

/* ========= APPOINTMENTS ========= */

function bookAppointment() {
  const role = localStorage.getItem("role");

  const subject = document.getElementById("subject").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
const role = localStorage.getItem("role");

if (
  (role === "staff" && withWhom !== "hod") ||
  (role === "hod" && withWhom !== "staff")
) {
  alert("Invalid booking target");
  return;
}

  const withWhom = document.getElementById("with")?.value || "";

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
    status: role === "student" ? "pending" : "approved",
    notifyAt,
    notified: false
  });

  localStorage.setItem("appointments", JSON.stringify(data));

  document.getElementById("msg").innerText = "Appointment booked";

  loadCalendarGrid();
  loadReminders();
  loadPendingRequests();
}

/* ========= CALENDAR ========= */

function loadCalendarGrid() {
  const grid = document.getElementById("calendarGrid");
  if (!grid) return;

  const role = localStorage.getItem("role");

  const data = (JSON.parse(localStorage.getItem("appointments")) || []).filter(a =>
    role === "student" ? true : a.with === role
  );

  grid.innerHTML = "";

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

/* ========= REMINDERS ========= */

function toggleReminder() {
  const panel = document.getElementById("reminderPanel");
  if (!panel) return;

  panel.style.display = panel.style.display === "block" ? "none" : "block";
}

function loadReminders() {
  const role = localStorage.getItem("role");
  const data = JSON.parse(localStorage.getItem("appointments")) || [];

  const relevant = data.filter(a =>
    a.status !== "rejected" &&
    (
      role === "student" ? false :
      role === "staff"   ? a.with === "staff" :
      role === "hod"     ? a.with === "hod" :
      false
    )
  );

  const panel = document.getElementById("reminderPanel");
  const count = document.getElementById("bell-count");

  if (count) count.innerText = relevant.length;

  if (panel) {
    panel.innerHTML = relevant.length
      ? relevant.map(a => `<p>${a.subject} – ${a.date} ${a.time}</p>`).join("")
      : "<p>No notifications</p>";
  }
}

/* ========= PENDING REQUESTS ========= */

function loadPendingRequests() {
  const role = localStorage.getItem("role");
  const data = JSON.parse(localStorage.getItem("appointments")) || [];

  const pending = data
    .map((a, i) => ({ ...a, index: i }))
    .filter(a => a.status === "pending" && a.with === role);

  const container = document.getElementById("pendingRequests");
  if (!container) return;

  container.innerHTML = pending.length
    ? pending.map(a => `
        <div class="calendar-day">
          <strong>${a.subject}</strong><br>
          ${a.date} ${a.time}
          <div class="action-buttons">
            <button onclick="approve(${a.index})">Approve</button>
            <button onclick="reject(${a.index})">Reject</button>
          </div>
        </div>
      `).join("")
    : "<p>No pending requests</p>";
}

function approve(index) {
  const data = JSON.parse(localStorage.getItem("appointments")) || [];
  data[index].status = "approved";
  localStorage.setItem("appointments", JSON.stringify(data));

  loadPendingRequests();
  loadReminders();
}

function reject(index) {
  const data = JSON.parse(localStorage.getItem("appointments")) || [];
  data[index].status = "rejected";
  localStorage.setItem("appointments", JSON.stringify(data));

  loadPendingRequests();
  loadReminders();
}

/* ========= IN-APP ALERT ========= */

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
