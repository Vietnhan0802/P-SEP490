import jwt from "jsonwebtoken";
const decodeToken = (token) => {
  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, "my-32-character-ultra-secure-and-ultra-long-secret"); // Replace "your-secret-key" with your actual secret key

    // The decoded object will contain the payload of the token
    return decoded;
  } catch (error) {
    // If there's an error (e.g., token is invalid or expired), handle it here
    console.error("Error decoding token:", error.message);
    return null;
  }
};

export default decodeToken;
