
const API_URL = "http://localhost:5000/api/auth";

document.addEventListener("DOMContentLoaded", (e) => {
    e.preventDefault();
    
    console.log("DOM fully ready!");

    //  REGISTER 
    const registerForm = document.querySelector("#register-form");
    const messageBox = document.querySelector("#message");

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.querySelector("#email")?.value.trim();
            const phoneNumber = document.querySelector("#phone")?.value.trim();
            const password = document.querySelector("#password")?.value.trim();
            const role = document.querySelector("#role")?.value;
            const otpMethod = document.querySelector("input[name='otpMethod']:checked")?.value;

            try {

                const response = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, phoneNumber, password, role, otpMethod })
                });

                const result = await response.json();
                
                console.log(result);

                if (!response.ok) {
                    messageBox.textContent = result.message || `Registration failed with status: ${response.status}`;
                    console.error("Registration failed:", result.message);
                    return; 
                }

                messageBox.textContent = result.message;

                if (result.success) {
                    localStorage.setItem("pendingUserId", result.userId);     
                    localStorage.setItem("otpMethod", otpMethod);

                    setTimeout(() => {
                        window.location.href = "verify-otp.html";
                    }, 500);
                } else {
                    messageBox.textContent = result.message || "Registration failed.";
                }



            } catch (error) {
                console.error("Registration Error:", error);
                messageBox.textContent = "Something went wrong. Try again.";
            }
        });
    }

    //  VERIFY OTP 
    const otpForm = document.querySelector('#verify-otp-form');
    const otpMessage = document.querySelector("#message");
    const resendButton = document.querySelector("#resend-otp-btn");

    if (otpForm) {
        otpForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const otp = document.querySelector("#otp").value.trim();
            const userId = localStorage.getItem("pendingUserId"); 

            if (!userId) {
                otpMessage.textContent = "Session expired. Please start again.";
                return;
            }

            const isLoginFlow = localStorage.getItem("token") !== null;
            const endpoint = isLoginFlow ? "verify-login-otp" : "verify-otp";

            try {
                const response = await fetch(`${API_URL}/${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, otp })
                });

                const result = await response.json();
                otpMessage.textContent = result.message;

                if (result.success) {
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("userRole", result.user.role);
                    localStorage.setItem("userEmail", result.user.email);
                    localStorage.removeItem("pendingUserId");  

                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1000);
                }
            } catch (error) {
                console.error("OTP Verify Error:", error);
                otpMessage.textContent = "Network error. Try again.";
            }
        });
    }

    //  RESEND OTP 
    if (resendButton) {
        resendButton.addEventListener("click", async (e) => {
            e.preventDefault();
            const userId = localStorage.getItem("pendingUserId");  
            const otpMethod = localStorage.getItem("otpMethod") || "email";

            if (!userId) {
                otpMessage.textContent = "No user session. Please register/login again.";
                return;
            }

            try {
                const response = await fetch(`${API_URL}/resend-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, otpMethod })
                });

                const result = await response.json();
                otpMessage.textContent = result.message;
            } catch (error) {
                otpMessage.textContent = "Failed to resend OTP.";
            }
        });
    }

    //  LOGIN 
    const loginForm = document.querySelector("#login-form");
    const loginMessage = document.querySelector("#login-message");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.querySelector("#login-email").value.trim();
            const password = document.querySelector("#login-password").value.trim();
            const otpMethod = document.querySelector("input[name='otpMethod']:checked")?.value;

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, otpMethod })
                });

                const result = await response.json();
                loginMessage.textContent = result.message;

                if (result.success) {
                    localStorage.setItem("pendingUserId", result.userId);  
                    localStorage.setItem("otpMethod", otpMethod);

                    setTimeout(() => {
                        window.location.href = "verify-otp.html";
                    }, 1000);
                }
            } catch (error) {
                loginMessage.textContent = "Login failed. Try again.";
            }
        });
    }

    // DASHBOARD & LOGOUT 
    const userEmailSpan = document.querySelector("#user-email");
    const userRoleSpan = document.querySelector("#user-role");
    const logoutBtn = document.querySelector("#logout-btn");

    if (userEmailSpan && userRoleSpan) {
        const token = localStorage.getItem("token");
        const userEmail = localStorage.getItem("userEmail");
        const userRole = localStorage.getItem("userRole");

        if (!token || !userEmail || !userRole) {
            window.location.href = "login.html";
        } else {
            userEmailSpan.textContent = userEmail;
            userRoleSpan.textContent = userRole;
        }
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "login.html";
        });
    }

    // Role-based dashboard buttons 
    const accessDashboard = async (role) => {
        const token = localStorage.getItem("token");
        if (!token) return window.location.href = "login.html";

        const responseBox = document.querySelector("#response-box");
        if (responseBox) responseBox.textContent = "Loading...";

        try {
            const res = await fetch(`http://localhost:5000/api/${role}/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (responseBox) {
                responseBox.textContent = data.success
                    ? JSON.stringify(data.data, null, 2)
                    : `Error: ${data.message}`;
            }
        } catch (err) {
            if (responseBox) responseBox.textContent = "Network error";
        }
    };

    document.querySelector("#student-btn")?.addEventListener("click", () => accessDashboard("student"));
    document.querySelector("#teacher-btn")?.addEventListener("click", () => accessDashboard("teacher"));
    document.querySelector("#admin")?.addEventListener("click", () => accessDashboard("admin"));
});