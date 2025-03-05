const generateCustomOtp = () => {
    const first = Math.floor(Math.random() * 9) + 1;
    let second = Math.floor(Math.random() * 10);
    second = (second + 2) % 10;
    const third = (second * 3) % 10;
    const last = Math.floor(Math.random() * 6) + 4;

    const otp = `${first}${second}${third}${last}`;
    return otp;
}
module.exports = generateCustomOtp;