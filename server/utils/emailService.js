// tried nodemailer as well

// import nodemailer from "nodemailer";                    // 

// export async function sendEmailOTP(email, otp) {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             port: process.env.EMAIL_PORT,
//             secure: false,
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         //EMAIL CONTENT

//         const mailOptions = {
//             from: process.env.EMAIL_FROM,
//             to: email,
//             subject: "Your OTP code",
//             text: `Your one-time password is: ${otp}\nThis code will expire in 5  minutes.`,
//         };

//         //send email
//         await transporter.sendMail(mailOptions);
//         console.log(`OTP email sent to ${email}`);
//         return true;

//     } catch (error) {
//         console.error("Email sending failed:", error);
//         throw new Error("Failed to send OTP email");
//     }
    
// }


import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.EMAIL_API_KEY);


export async function sendEmailOTP(email, otp) {
  try {
    console.log("[SIMULATED EMAIL OTP]");
    console.log(`To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log("Status: Email sent successfully (simulation mode)");
    return true;
  } catch (error) {
    console.error("Email OTP Simulation Failed:", error);
    throw new Error("Failed to simulate sending OTP email");
  }
}