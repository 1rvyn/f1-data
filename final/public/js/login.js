// Get and set element 'form'
const form = document.querySelector(".login-form");
// Get and set element 'username'
const username = document.querySelector("#username");
// Get and set element 'password'
const password = document.querySelector("#password");
// Get and set element 'username' (error display)
const display = document.querySelector(".error");
// Add an event listener to the login button and utalise the api to process login event
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  display.textContent = "";
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.status === 400 || res.status === 401) {
      return (display.textContent = `${data.message}. ${
        data.error ? data.error : ""
      }`);
    }
    // Direct user per their role
    data.role === "Admin" ? location.assign("/admin") : location.assign("/");
  } catch (err) {
    console.log(err.message);
  }
});
