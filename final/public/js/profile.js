// Get and set element 'h3'
const h3 = document.querySelector("h3");
// Get and set username
const username = JSON.parse($('#usernameJSON').text());
console.log("profile.js:", username);
// Create constant that utalises an api call to return all the users within the database
const getUserData = async () => {
  try {
    const res = await fetch("/api/auth/getUserData", {
      method: "POST",
      body: JSON.stringify({
        username: username.value,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    data.user.map((mappedUser) => {
      if (mappedUser.username !== username) {
        let h3i = `<h3> <b>Username</b>: ${mappedUser.username} <br> <b>Role</b>: ${mappedUser.role} </h3> <b>Date of Registration</b>: ${mappedUser.dateOfRegistration} </h3>`;
        h3.innerHTML += h3i;
      } else {
        return null;
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};
// Call the get user data function
getUserData();
