const token = localStorage.getItem("token");
if (!token || localStorage.getItem("role") !== "admin") {
  alert("Unauthorized");
  window.location.href = "login.html";
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

// Add Teacher
document.getElementById("teacherForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("tname").value;
  const username = document.getElementById("tusername").value;
  const password = document.getElementById("tpassword").value;
  const subjects = document.getElementById("tsubjects").value.split(",").map(s => s.trim());

  try {
    const res = await fetch("http://localhost:5000/api/admin/add-teacher", {
      method: "POST",
      headers,
      body: JSON.stringify({ name, username, password, subjects }),
    });

    const data = await res.json();
    alert(data.message || "Failed to add teacher");
  } catch (err) {
    console.error(err);
    alert("Error occurred");
  }
});

// Add Student
document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("sname").value;
  const rollNo = document.getElementById("sroll").value;
  const subjects = document.getElementById("ssubjects").value.split(",").map(s => s.trim());

  try {
    const res = await fetch("http://localhost:5000/api/admin/add-student", {
      method: "POST",
      headers,
      body: JSON.stringify({ name, rollNo, subjects }),
    });

    const data = await res.json();
    alert(data.message || "Failed to add student");
  } catch (err) {
    console.error(err);
    alert("Error occurred");
  }
});

// Add Subject
document.getElementById("subjectForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("subname").value;
  const priority = document.getElementById("priority").value;

  try {
    const res = await fetch("http://localhost:5000/api/admin/add-subject", {
      method: "POST",
      headers,
      body: JSON.stringify({ name, priority }),
    });

    const data = await res.json();
    alert(data.message || "Failed to add subject");
  } catch (err) {
    console.error(err);
    alert("Error occurred");
  }
});

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}
