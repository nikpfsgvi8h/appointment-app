function login() {
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    if (email === "" || role === "") {
        alert("Please enter email and select role");
        return;
    }

    if (role === "hod") {
        window.location.href = "hod.html";
    } else if (role === "staff") {
        window.location.href = "staff.html";
    } else if (role === "student") {
        window.location.href = "student.html";
    }
}
