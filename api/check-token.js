const { readFileSync } = require("fs");
const { join } = require("path");
const file = readFileSync(join(__dirname, "helpers", "checkToken.js"), "utf8");
const checkToken = require(file);

export default async function checkRecaptcha(req, res) {
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
