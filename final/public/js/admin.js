// Get and set element 'ul'
const ul = document.querySelector("ul");
// Get and set element 'display'
const display = document.querySelector(".display");
// Get all users from database via api
const getUsers = async () => {
  const res = await fetch("/api/auth/getUsers");
  const data = await res.json();
  // Using the data obtained, map out the users that are admins
  data.user.map((mappedUser) => {
    if (mappedUser.username !== "Admin") {
      let li = `<li> <b>Username</b>: ${mappedUser.username} <br> <b>Role</b>: ${mappedUser.role} </li> <b>Date of Registration</b>: ${mappedUser.dateOfRegistration} </li> <br><button class="edit">Edit Role</button> <button class="delete">Delete User</button>`;
      ul.innerHTML += li;
    } else {
      return null;
    }
    // Get and set element 'edit'
    const editRole = document.querySelectorAll(".edit");
    // For each user, add an event listener to each edit button to amend the user accordingly
    editRole.forEach((button, i) => {
      button.addEventListener("click", async () => {
        display.textContent = "";
        const id = data.user[i + 1].id;
        const res = await fetch("/api/auth/update", {
          method: "PUT",
          body: JSON.stringify({ role: "Admin", id }),
          headers: { "Content-Type": "application/json" },
        });
        const dataUpdate = await res.json();
        if (res.status === 400 || res.status === 401) {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          return (display.textContent = `${dataUpdate.message}. ${
            dataUpdate.error ? dataUpdate.error : ""
          }`);
        }
        location.assign("/admin");
      });
    });
    // Get and set element 'delete'
    const deleteUser = document.querySelector(".delete");
    // For each user, add an event listener to each delete button to delete the user accordingly
    deleteUser.forEach((button, i) => {
      button.addEventListener("click", async () => {
        display.textContent = "";
        const id = data.user[i + 1].id;
        const res = await fetch("/api/auth/deleteUser", {
          method: "DELETE",
          body: JSON.stringify({ id }),
          headers: { "Content-Type": "application/json" },
        });
        const dataDelete = await res.json();
        if (res.status === 401) {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          return (display.textContent = `${dataDelete.message}. ${
            dataDelete.error ? dataDelete.error : ""
          }`);
        }
        location.assign("/admin");
      });
    });
  });
};
// Call the get all users function
getUsers();
