const token = localStorage.getItem("token");
if (!token || localStorage.getItem("role") !== "student") {
  alert("Unauthorized");
  window.location.href = "login.html";
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

async function loadAttendance() {
  try {
    const res = await fetch("http://localhost:5000/api/student/attendance", {
      method: "GET",
      headers,
    });

    const data = await res.json();
    const container = document.getElementById("attendanceList");
    container.innerHTML = "";

    if (data.subjects.length === 0) {
      container.innerHTML = "<p>No attendance records found.</p>";
      return;
    }

    data.subjects.forEach(subject => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${subject.subject}</strong><br>
        Attended: ${subject.attended} / ${subject.totalClasses}<br>
        Percentage: ${subject.percentage}%<br>
        <hr>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to fetch attendance.");
  }
}

// 🔚 Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
