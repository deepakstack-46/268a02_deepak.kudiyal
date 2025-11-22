export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOtpExpiry() {
    return new Date(Date.now() + 5 * 60 * 1000).toISOString();
}