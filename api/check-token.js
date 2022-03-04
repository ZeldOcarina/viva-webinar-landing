import axios from "axios";

export default async function checkRecaptcha(req, res) {
  async function checkToken({ token, ip }) {
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

  try {
    const isTokenValid = await checkToken({
      token: req.body.token,
      //ip: req.ip,
    });
    if (!isTokenValid) throw new Error("Invalid recaptcha");
    res.status(200).json({ status: "success", data: "Token is valid" });
  } catch (err) {
    if (err.message === "Invalid recaptcha")
      return res
        .status(403)
        .json({ status: "error", data: "Invalid recaptcha" });
    console.error(err.stack);
    res.status(500).json({ status: "error", data: "Server error" });
  }
}
