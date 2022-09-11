// Get and set element 'ul'
const ul = document.querySelector("ul");
// Create constant that utalises an api call to return all the users within the database
const getUsers = async () => {
  const res = await fetch("/api/auth/getUsers");
  const data = await res.json();
  data.user.map((mappedUser) => {
    if (mappedUser.username !== "Admin") {
      let li = `<li> <b>Username</b>: ${mappedUser.username} <br> <b>Role</b>: ${mappedUser.role} </li> <b>Date of Registration</b>: ${mappedUser.dateOfRegistration} </li>`;
      ul.innerHTML += li;
    } else {
      return null;
    }
  });
};
// Call the get all users function
getUsers();
