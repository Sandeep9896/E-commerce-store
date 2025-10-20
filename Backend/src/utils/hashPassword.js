// 🔒 Encrypt password before saving
import bcrypt from "bcrypt";
export const encryptPassword = async (password) => {
  if (!password) return;
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
  
};

export const matchPassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};