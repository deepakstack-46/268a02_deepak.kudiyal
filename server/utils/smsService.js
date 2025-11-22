// import twilio from "twilio";

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// export async function sendSmsOTP(phoneNumber, otp) {
//   try {
//     await client.messages.create({
//       body: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phoneNumber
//     });

//     console.log(`OTP SMS sent to ${phoneNumber}`);
//     return true;

//   } catch (error) {
//     console.error("SMS sending failed:", error.message);
//     throw new Error("Failed to send OTP SMS");
//   }
// }


export async function sendSmsOTP(phoneNumber, otp) {
  try {
    console.log("[SIMULATED SMS OTP]");
    console.log(`To: ${phoneNumber}`);
    console.log(`OTP: ${otp}`);
    console.log("Status: SMS sent successfully (simulation mode)");
    return true;
  } catch (error) {
    console.error("SMS OTP Simulation Failed:", error);
    throw new Error("Failed to simulate sending OTP SMS");
  }
}