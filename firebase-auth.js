// 1. First, add Firebase SDK to your HTML file (add this before your closing </body> tag in index.html)
// <!-- Firebase App (the core Firebase SDK) -->
// <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js"></script>
// <!-- Firebase Authentication -->
// <script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"></script>
// <script src="firebase-config.js"></script>

// 2. Create a new file called firebase-config.js with your Firebase configuration
// firebase-config.js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // 3. Modify your login.js to use Firebase Authentication
  document.addEventListener("DOMContentLoaded", function () {
      // Toggle password visibility (keep your existing code)
      const togglePassword = document.querySelector(".toggle-password");
      const passwordInput = document.getElementById("password");
  
      if (togglePassword && passwordInput) {
          togglePassword.addEventListener("click", function () {
              const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
              passwordInput.setAttribute("type", type);
  
              // Toggle eye icon
              this.querySelector("i").classList.toggle("fa-eye");
              this.querySelector("i").classList.toggle("fa-eye-slash");
          });
      } else {
          console.error("Toggle password button or password input not found.");
      }
  
      // Add animation to the duck if exists (keep your existing code)
      if (document.querySelector(".duck")) {
          animateDuck();
      } else {
          console.warn("Duck animation element not found.");
      }
  
      // Handle login form submission with Firebase
      const loginForm = document.getElementById("loginForm");
  
      if (loginForm) {
          loginForm.addEventListener("submit", function (e) {
              e.preventDefault();
  
              const email = document.getElementById("username")?.value || "";
              const password = document.getElementById("password")?.value || "";
              const rememberMe = document.getElementById("rememberMe")?.checked || false;
  
              // Add simple validation
              if (email.trim() === "" || password.trim() === "") {
                  showNotification("Please fill in all fields", "error");
                  return;
              }
  
              // Show loading state
              const loginButton = document.querySelector(".login-button");
              if (loginButton) {
                  const originalText = loginButton.textContent;
                  loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
                  loginButton.disabled = true;
  
                  // Set persistence based on "Remember Me" checkbox
                  const persistence = rememberMe ? 
                      firebase.auth.Auth.Persistence.LOCAL : 
                      firebase.auth.Auth.Persistence.SESSION;
                  
                  auth.setPersistence(persistence)
                      .then(() => {
                          // Sign in with email and password
                          return auth.signInWithEmailAndPassword(email, password);
                      })
                      .then((userCredential) => {
                          // Signed in successfully
                          showNotification("Login successful!", "success");
                          setTimeout(() => {
                              window.location.href = "homepage.html";
                          }, 1000);
                      })
                      .catch((error) => {
                          // Handle errors
                          loginButton.innerHTML = originalText;
                          loginButton.disabled = false;
                          
                          let errorMessage = "Login failed. Please check your credentials.";
                          if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                              errorMessage = "Invalid email or password.";
                          } else if (error.code === "auth/too-many-requests") {
                              errorMessage = "Too many failed login attempts. Please try again later.";
                          }
                          
                          showNotification(errorMessage, "error");
                      });
              } else {
                  console.error("Login button not found.");
              }
          });
      } else {
          console.error("Login form not found.");
      }
  
      // Add authentication state observer
      auth.onAuthStateChanged((user) => {
          if (user) {
              // User is signed in, redirect to homepage if they're on the login page
              if (window.location.pathname.includes("index.html") || 
                  window.location.pathname.endsWith("/")) {
                  window.location.href = "homepage.html";
              }
          } else {
              // User is signed out, redirect to login page if they're trying to access protected pages
              if (window.location.pathname.includes("homepage.html")) {
                  window.location.href = "index.html";
              }
          }
      });
  
      // Make the duck "quack" when clicked (keep your existing code)
      const duck = document.querySelector(".duck");
      if (duck) {
          duck.addEventListener("click", function () {
              // Create quack bubble
              const quack = document.createElement("div");
              quack.className = "quack-bubble";
              quack.textContent = "Quack!";
  
              // Ensure the duck display exists
              const duckDisplay = document.querySelector(".duck-display");
              if (duckDisplay) {
                  duckDisplay.appendChild(quack);
              } else {
                  console.warn("Duck display not found.");
                  return;
              }
  
              // Make duck jump
              duck.style.transform = "translateY(-15px)";
              setTimeout(() => {
                  duck.style.transform = "";
              }, 300);
  
              // Remove the bubble after animation
              setTimeout(() => {
                  quack.remove();
              }, 1500);
          });
      } else {
          console.warn("Duck element not found.");
      }
  });
  
  // Keep your existing functions (showNotification and animateDuck)
  function showNotification(message, type) {
      const notification = document.createElement("div");
      notification.className = "notification " + type;
      notification.textContent = message;
  
      document.body.appendChild(notification);
  
      // Show notification with animation
      setTimeout(() => {
          notification.style.transform = "translateY(0)";
          notification.style.opacity = "1";
      }, 10);
  
      // Remove after delay
      setTimeout(() => {
          notification.style.transform = "translateY(-10px)";
          notification.style.opacity = "0";
          setTimeout(() => {
              notification.remove();
          }, 300);
      }, 3000);
  }
  
  // Duck animation function for gentle floating effect
  function animateDuck() {
      const duck = document.querySelector(".duck");
      if (!duck) return; // Ensure the duck element exists
  
      let floatY = 0;
      let floatDirection = 1;
  
      function flapWings() {
          const wing = document.querySelector(".duck-wing");
          if (!wing) return;
  
          wing.style.transition = "transform 0.2s ease-in-out";
          wing.style.transform = "rotate(35deg)";
  
          setTimeout(() => {
              wing.style.transform = "rotate(20deg)";
          }, 200);
  
          // Schedule next flap randomly
          setTimeout(flapWings, Math.random() * 5000 + 3000);
      }
  
      // Start wing flapping
      setTimeout(flapWings, 2000);
  }
  
  // Add signup functionality (for the "Sign Up" link)
  function handleSignup() {
      // Create a signup page or modal and connect it to Firebase authentication
      const signupLink = document.querySelector(".signup-option a");
      if (signupLink) {
          signupLink.addEventListener("click", function(e) {
              e.preventDefault();
              // Redirect to signup page or show signup modal
              // For now, let's just show a notification
              showNotification("Signup functionality coming soon!", "success");
          });
      }
  }
  
  // Call the signup handler
  handleSignup();