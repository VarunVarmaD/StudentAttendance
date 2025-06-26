const token = localStorage.getItem("token");
if (!token || localStorage.getItem("role") !== "teacher") {
  alert("Unauthorized");
  window.location.href = "login.html";
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// 🟩 Mark Attendance
document.getElementById("markForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const subjectId = document.getElementById("subjectId").value.trim();
  const studentId = document.getElementById("studentId").value.trim();

  try {
    const res = await fetch("http://localhost:5000/api/teachers/mark", {
      method: "POST",
      headers,
      body: JSON.stringify({ subjectId, studentId }),
    });

    const data = await res.json();
    alert(data.message || data.error);
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
});

// 📋 Load students
async function loadStudents() {
  try {
    const res = await fetch("http://localhost:5000/api/teachers/students", {
      method: "GET",
      headers,
    });

    const data = await res.json();
    const container = document.getElementById("studentList");
    container.innerHTML = "";

    if (data.students.length === 0) {
      container.innerHTML = "<p>No students found.</p>";
      return;
    }

    data.students.forEach(student => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${student.name}</strong> (${student.rollNo})<br>
        Subjects: ${student.subjects.map(s => s.name).join(", ")}<br>
        Attendance: <ul>
          ${student.attendance.map(a => `
            <li>${a.subject.name} — ${new Date(a.date).toLocaleDateString()}</li>
          `).join("")}
        </ul>
        <hr>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to fetch students.");
  }
}

// 🔚 Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
