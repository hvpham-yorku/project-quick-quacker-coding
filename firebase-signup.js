// Create a new file called signup.js for the signup functionality

// Function to handle user registration
function registerUser(email, password, username) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Update the user profile with the username
            return userCredential.user.updateProfile({
                displayName: username
            }).then(() => {
                return userCredential.user;
            });
        });
}

// Create a simple signup form handler
document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signupForm");
    
    if (signupForm) {
        signupForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const username = document.getElementById("signupUsername").value;
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            
            // Basic validation
            if (!username || !email || !password || !confirmPassword) {
                showNotification("Please fill in all fields", "error");
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification("Passwords do not match", "error");
                return;
            }
            
            // Show loading state
            const signupButton = document.querySelector(".signup-button");
            if (signupButton) {
                const originalText = signupButton.textContent;
                signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
                signupButton.disabled = true;
                
                registerUser(email, password, username)
                    .then((user) => {
                        showNotification("Account created successfully!", "success");
                        setTimeout(() => {
                            window.location.href = "homepage.html";
                        }, 1500);
                    })
                    .catch((error) => {
                        signupButton.innerHTML = originalText;
                        signupButton.disabled = false;
                        
                        let errorMessage = "Registration failed. Please try again.";
                        if (error.code === "auth/email-already-in-use") {
                            errorMessage = "This email is already registered.";
                        } else if (error.code === "auth/weak-password") {
                            errorMessage = "Password is too weak. Please use at least 6 characters.";
                        } else if (error.code === "auth/invalid-email") {
                            errorMessage = "Invalid email address.";
                        }
                        
                        showNotification(errorMessage, "error");
                    });
            }
        });
    }
});

// Function to implement "Forgot Password" functionality
function setupForgotPassword() {
    const forgotPasswordLink = document.querySelector(".forgot-password");
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function(e) {
            e.preventDefault();
            
            const email = prompt("Please enter your email address to reset your password:");
            
            if (email) {
                auth.sendPasswordResetEmail(email)
                    .then(() => {
                        showNotification("Password reset email sent! Check your inbox.", "success");
                    })
                    .catch((error) => {
                        let errorMessage = "Failed to send reset email. Please try again.";
                        if (error.code === "auth/user-not-found") {
                            errorMessage = "No account found with this email.";
                        } else if (error.code === "auth/invalid-email") {
                            errorMessage = "Invalid email address.";
                        }
                        
                        showNotification(errorMessage, "error");
                    });
            }
        });
    }
}

// Call the forgot password setup function
setupForgotPassword();