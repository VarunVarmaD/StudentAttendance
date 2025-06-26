let selectedRole = "";

document.querySelectorAll(".role-buttons button").forEach((btn) => {
  btn.addEventListener("click", async () => {
    selectedRole = btn.getAttribute("data-role");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      document.getElementById("error").textContent = "Please enter username and password.";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        document.getElementById("error").textContent = data.error || "Login failed";
        return;
      }

      // Save token and redirect based on actual role from server
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") window.location.href = "admin.html";
      else if (data.role === "teacher") window.location.href = "teacher.html";
      else if (data.role === "student") window.location.href = "student.html";
      else document.getElementById("error").textContent = "Unknown role";

    } catch (err) {
      console.error("Login error:", err);
      document.getElementById("error").textContent = "Network error";
    }
  });
});
