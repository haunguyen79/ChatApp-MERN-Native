import { UserProps } from "../types";
import jwt from "jsonwebtoken";

export const 
generateToken = (user: any) => {
  const payload = {
    user: {
      id: user._id?.toString() || user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// '30d' => 30 days
// '1m' => 1 month
// '1y' => 1 year
// '24h' => 24 hours
// '60s' => 60 seconds
