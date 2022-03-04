import axios from "axios";

export default async function checkToken({ token, ip }) {
  try {
    const params = new URLSearchParams();
    params.append("secret", process.env.RECAPTCHA_SECRET_KEY);
    params.append("response", token);
    ip && params.append("remoteip", ip);

    const response = await axios({
      method: "POST",
      url: "https://www.google.com/recaptcha/api/siteverify",
      data: params.toString(),
    });

    return response.data.success;
  } catch (err) {
    console.error(err);
    return false;
  }
}
