import jwt from "jsonwebtoken";


const genToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "SECRET_KEY_123",
    { expiresIn: "7d" }
  );
};

  export default genToken
