function login() {
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    if (email === "" || role === "") {
        alert("Please enter email and select role");
        return;
    }

    // save session
    localStorage.setItem("loggedInUser", JSON.stringify({
        email: email,
        role: role
    }));

    if (role === "student") location.href = "student.html";
    if (role === "staff") location.href = "staff.html";
    if (role === "hod") location.href = "hod.html";
}

// STUDENT: BOOK APPOINTMENT
function bookAppointment(role) {
    const subject = document.getElementById("subject").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const withWhom = document.getElementById("with")?.value || "any";

    if (!subject || !date || !time) {
        document.getElementById("msg").innerText = "Please fill all fields";
        return;
    }

    // ROLE RULES
    if (role === "staff" && withWhom !== "hod") {
        document.getElementById("msg").innerText =
            "Staff can book appointments only with HOD";
        return;
    }

    if (role === "hod" && withWhom !== "staff") {
        document.getElementById("msg").innerText =
            "HOD can book appointments only with Staff";
        return;
    }

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

   appointments.push({
    subject,
    date,
    time,
    bookedBy: role,
    bookedWith: withWhom,
    status: "Pending"
});


    localStorage.setItem("appointments", JSON.stringify(appointments));

    document.getElementById("msg").innerText =
        "Appointment booked successfully!";
}
// STAFF & HOD: VIEW APPOINTMENTS
function loadAppointments() {
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    let list = document.getElementById("list");

    if (!list) return;

    list.innerHTML = "";

    if (appointments.length === 0) {
        list.innerHTML = "<li>No appointments found</li>";
        return;
    }

    appointments.forEach(a => {
        let li = document.createElement("li");
        li.innerText = `${a.subject} | ${a.date} | ${a.time}`;
        list.appendChild(li);
    });
}

function loadCalendar(role) {
    const data = JSON.parse(localStorage.getItem("appointments")) || [];
    const calendar = document.getElementById("calendar");
    calendar.innerHTML = "";

    if (data.length === 0) {
        calendar.innerHTML = "<p>No appointments</p>";
        return;
    }

    const grouped = {};

    data.forEach((a, index) => {
        if (
            a.bookedBy === "student" ||
            (role === "staff" && a.bookedBy === "hod") ||
            (role === "hod" && a.bookedBy === "staff")
        ) {
            if (!grouped[a.date]) grouped[a.date] = [];
            grouped[a.date].push({ ...a, index });
        }
    });

    for (let date in grouped) {
        const card = document.createElement("div");
        card.className = "calendar-card";

        card.innerHTML = `<h4>${date}</h4>`;

        grouped[date].forEach(a => {
            const item = document.createElement("div");
            item.className = "calendar-item";

            item.innerHTML = `
                <strong>${a.time}</strong> — ${a.subject}<br>
                <small>${a.bookedBy} → ${a.bookedWith}</small><br>
                <span>Status: <b>${a.status}</b></span>
            `;

            if (a.status === "Pending") {
                const approve = document.createElement("button");
                approve.innerText = "Approve";
                approve.onclick = () => updateStatus(a.index, "Approved");

                const reject = document.createElement("button");
                reject.innerText = "Reject";
                reject.onclick = () => updateStatus(a.index, "Rejected");

                item.appendChild(approve);
                item.appendChild(reject);
            }

            card.appendChild(item);
        });

        calendar.appendChild(card);
    }
}

function toggleReminder() {
    const panel = document.getElementById("reminderPanel");
    panel.classList.toggle("show");

    const reminders = document.getElementById("reminders");
    reminders.innerHTML = "";

    const data = JSON.parse(localStorage.getItem("appointments")) || [];

    if (data.length === 0) {
        reminders.innerHTML = "<p>No upcoming appointments</p>";
        return;
    }

    data.slice(-3).forEach(a => {
        const div = document.createElement("div");
        div.innerText = `${a.subject} on ${a.date} at ${a.time}`;
        reminders.appendChild(div);
    });
}

function updateStatus(index, newStatus) {
    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments[index].status = newStatus;
    localStorage.setItem("appointments", JSON.stringify(appointments));
    location.reload();
}

function logout() {
    localStorage.removeItem("loggedInUser");
    location.href = "index.html";
}

function checkAuth(requiredRole) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user || user.role !== requiredRole) {
        location.href = "index.html";
    }
}
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

