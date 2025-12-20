function login() {
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    if (email === "" || role === "") {
        alert("Please enter email and select role");
        return;
    }

    if (role === "student") location.href = "student.html";
    if (role === "staff") location.href = "staff.html";
    if (role === "hod") location.href = "hod.html";
}

// STUDENT: BOOK APPOINTMENT
function bookAppointment() {
    const subject = document.getElementById("subject").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!subject || !date || !time) {
        document.getElementById("msg").innerText = "Fill all fields";
        return;
    }

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.push({ subject, date, time });

    localStorage.setItem("appointments", JSON.stringify(appointments));

    document.getElementById("msg").innerText = "Appointment booked!";
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
