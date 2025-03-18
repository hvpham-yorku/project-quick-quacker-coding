document.addEventListener("DOMContentLoaded", function () {
  // Animate the duck slightly
  const duck = document.querySelector(".duck");
  let up = true;
  setInterval(() => {
    duck.style.transform = up ? "translateY(-5px)" : "translateY(0)";
    up = !up;
  }, 1500);

  // Check if user is already logged in
  fetch('/api/check-auth')
    .then(response => response.json())
    .then(data => {
      if (data.loggedIn) {
        // User is already logged in, redirect to main app
        window.location.href = "duckhtml.html";
      }
    })
    .catch(error => {
      console.error('Auth check error:', error);
    });

  // Login button event listener
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    // Basic validation
    if (!username || !password) {
      alert("Please enter both username and password!");
      return;
    }
    
    // Send login request to backend
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        loginSuccess();
      } else {
        alert('Login failed: ' + (data.message || 'Invalid credentials'));
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    });
  });

  // Function to handle successful login
  function loginSuccess() {
    // Duck celebrates!
    const duck = document.querySelector(".duck");
    duck.style.transform = "scale(1.2)";
    
    setTimeout(() => {
      duck.style.transform = "";
      
      // Redirect to main app after animation
      setTimeout(() => {
        window.location.href = "duckhtml.html";
      }, 300);
    }, 500);
  }
  
  // Handle signup link
  const signupLink = document.querySelector(".signup-link a");
  if (signupLink) {
    signupLink.addEventListener("click", function(e) {
      e.preventDefault();
      const loginContainer = document.querySelector(".login-container");
      
      // Replace login form with signup form
      loginContainer.innerHTML = `
        <h2 class="login-title">Join Quacker!</h2>
        
        <div class="login-form">
          <div class="input-group">
            <label for="signup-name">Full Name</label>
            <input type="text" id="signup-name" placeholder="Enter your name" />
          </div>
          
          <div class="input-group">
            <label for="signup-username">Username</label>
            <input type="text" id="signup-username" placeholder="Choose a username" />
          </div>
          
          <div class="input-group">
            <label for="signup-password">Password</label>
            <input type="password" id="signup-password" placeholder="Create a password" />
          </div>
          
          <button id="signup-button" class="login-button">Sign Up</button>
          
          <div class="signup-link">
            Already have an account? <a href="#" id="back-to-login">Log in</a>
          </div>
        </div>
      `;
      
      // Add event listener for signup button
      document.getElementById("signup-button").addEventListener("click", function() {
        const name = document.getElementById("signup-name").value;
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;
        
        // Basic validation
        if (!name || !username || !password) {
          alert("All fields are required!");
          return;
        }
        
        // Send signup request
        fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, username, password }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            loginSuccess();
          } else {
            alert('Signup failed: ' + (data.message || 'Unknown error'));
          }
        })
        .catch(error => {
          console.error('Signup error:', error);
          alert('Signup failed. Please try again.');
        });
      });
      
      // Back to login link
      document.getElementById("back-to-login").addEventListener("click", function(e) {
        e.preventDefault();
        window.location.reload();
      });
    });
  }
  
  // Optional: Press Enter to login
  document.getElementById("password").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      loginButton.click();
    }
  });
  
  // Handle forgot password
  const forgotLink = document.querySelector(".forgot-link");
  if (forgotLink) {
    forgotLink.addEventListener("click", function(e) {
      e.preventDefault();
      alert("For this demo, use username: 'admin' and password: 'quackadmin'");
    });
  }
});