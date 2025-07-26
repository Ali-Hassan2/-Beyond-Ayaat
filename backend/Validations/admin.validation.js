const z = require("zod");

const adminvalildationSchema = z.object({
  first_name: z
    .string()
    .min(3, { message: "First name should be at least 3 characters" }),
  last_name: z
    .string()
    .min(3, { message: "Last name should be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
module.exports = adminvalildationSchema;
