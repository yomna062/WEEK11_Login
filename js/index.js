document.addEventListener("DOMContentLoaded", function () {
  const regForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const logoutButton = document.getElementById("logoutButton");
  const navLoginButton = document.getElementById("navLoginButton");

  const regError = document.getElementById("registerError");
  const loginError = document.getElementById("loginError");
  const welcomeMessage = document.getElementById("welcomeMessage");

  const registrationDiv = document.getElementById("registration");
  const loginDiv = document.getElementById("login");
  const homeDiv = document.getElementById("home");

  function showPage(page) {
    const pages = [registrationDiv, loginDiv, homeDiv];
    for (const div of pages) {
      div.classList.toggle("active", div === page);
    }
    navLoginButton.style.display = page === registrationDiv ? "block" : "none";
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  function findUserByEmail(email) {
    return getUsers().find(user => user.email === email);
  }

  function initialize() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      showPage(homeDiv);
      welcomeMessage.textContent = `Welcome, ${loggedInUser}!`;
    } else {
      showPage(registrationDiv);
    }
  }

  function handleRegistration(event) {
    event.preventDefault();
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (findUserByEmail(email)) {
      Swal.fire({
          color:"black",
          icon: "error",
          title: "Email Already Registered",
          text: "Use a different email address.",
          confirmButtonColor: 'red'
      });
  } else {
      const users = getUsers();
      users.push({ username, email, password });
      saveUsers(users);
  
      Swal.fire({
        color:"black",
          icon: "success",
          title: "Registration Successful",
          text: "Your account has been created. Please login.",
          confirmButtonColor: 'green'
      }).then(() => {
          showPage(loginDiv); // Navigate to the login page after user dismisses the alert
      });
  }
  
  }

  function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const user = findUserByEmail(email);
    if (user && user.password === password) {
      sessionStorage.setItem("loggedInUser", user.username);
      loginError.textContent = "";
      welcomeMessage.textContent = `Welcome, ${user.username}!`;
      showPage(homeDiv);
    } else {
      loginError.textContent = "Invalid email or password.";
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("loggedInUser");
    showPage(loginDiv);
  }


  navLoginButton.addEventListener("click", () => showPage(loginDiv));

  regForm.addEventListener("submit", handleRegistration);
  loginForm.addEventListener("submit", handleLogin);
  logoutButton.addEventListener("click", handleLogout);

  initialize();
});
