# OTP Authentication System  
(ITAS 268 — Assignment 2)

This project implements an OTP-based authentication workflow using Node.js and Express.  
Users can register, verify their account using an OTP, log in with OTP, and access protected dashboards based on roles.

The system stores users in a JSON file and supports both SMS and email OTP.  
(For this submission, Twilio and SendGrid OTP sending are running in simulation mode, and OTP is logged to the terminal.)

---
## Before running 

 The Real OTP was sending normally earlier , but it seems the Twilio trial limits or verification rules kicked in later or may be they blocked my number, so it stopped sending real SMS. The code is fully connected to Twilio, So i had to use  simulation mode now and shows the OTP in the  console, and the full authentication flow can still be tested

## Features

- User Registration with OTP
- OTP Verification after Registration
- Login with OTP
- JWT-based Authentication
- Role-Based Access Control (Student, Teacher, Admin)
- Protected API Routes
- Simple Client UI (HTML, CSS, JavaScript)

---

## Project Structure

```
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
  users.json

client/
  index.html
  login.html
  verify-otp.html
  dashboard.html
  assets/
  app.js
```

---

## Environment Variables

A `.env` file is required with the following values:

```
PORT=5000
JWT_SECRET=secret
JWT_EXPIRE=24h

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

EMAIL_API_KEY=
EMAIL_FROM=
```

A `.env.example` file is included which should be .env to test the project.

---

## Running the Project

### 1. Install dependencies

```
cd server
npm install
```

### 2. Start the server

```
node server.js
```

If everything is running correctly, the terminal will print:

```
Server running on http://localhost:5000
```

OTP messages will also appear here in simulation mode.

---

## Running the Server with Docker

This project also includes a Docker configuration so the backend can run in a container.

### Build the Docker image:
- docker build -t otp-auth-app

### Run the container
- docker run -p 5050:5000 --env-file .env opt-auth-app

- once running, open:
    - htpp://localhost:5000


## Testing With Postman

### **1. Register**
POST → `/api/auth/register`

Example body:

```
{
  "email": "deepak.kudiyal@itas.ca",
  "phoneNumber": "+17788926207",
  "password": "12345",
  "role": "student",
  "otpMethod": "sms"
}
```

### **2. Verify OTP**
POST → `/api/auth/verify-otp`  
Use the OTP shown in the terminal.

### **3. Login**
POST → `/api/auth/login`

### **4. Verify Login OTP**
POST → `/api/auth/verify-login-otp`  
This returns a JWT token.

### **5. Access Protected Routes**

Add the token in **Authorization → Bearer Token**.

```
GET /api/student/dashboard
GET /api/teacher/dashboard
GET /api/admin/dashboard
```

Access is based on the user’s role.

---

## Notes

- OTP is currently simulated and printed in the terminal.
- The frontend works but refreshes after submission (this is acceptable for the assignment).

---

## Status

- Backend complete  
- Authentication + OTP verified  
- Dashboards working  
- Testing done through Postman  
- Frontend connected  
- Simulation mode running



