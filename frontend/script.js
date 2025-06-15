const API_BASE = 'http://localhost:5000/api/students';

// Elements
const studentForm = document.getElementById('studentForm');
const nameInput = document.getElementById('name');
const rollNoInput = document.getElementById('rollNo');
const studentTableBody = document.getElementById('studentTableBody');

// 1️⃣ Add Student
studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const rollNo = rollNoInput.value.trim();

  if (!name || !rollNo) return alert('Please fill in all fields.');

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rollNo })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Student added!');
      studentForm.reset();
      fetchStudents(); // refresh table
    } else {
      alert(data.error || 'Failed to add student');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong!');
  }
});

// 2️⃣ Load All Students
async function fetchStudents() {
  try {
    const res = await fetch(API_BASE);
    const students = await res.json();

    studentTableBody.innerHTML = ''; // clear table

    students.forEach((student) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${student.name}</td>
        <td>${student.rollNo}</td>
        <td>${student.attendance.length}</td>
        <td>
          <button onclick="markAttendance('${student.rollNo}')">Mark</button>
        </td>
      `;

      studentTableBody.appendChild(tr);
    });
  } catch (err) {
    console.error('Failed to load students:', err);
  }
}

// 3️⃣ Mark Attendance
async function markAttendance(rollNo) {
  try {
    const res = await fetch(`${API_BASE}/mark-attendance/${rollNo}`, {
      method: 'POST'
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Attendance marked for ${rollNo}`);
      fetchStudents(); // refresh table
    } else {
      alert(data.error || 'Failed to mark attendance');
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong while marking attendance!');
  }
}

// 👟 Initial load
fetchStudents();
