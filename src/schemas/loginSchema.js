import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email({ message: "Correo inválido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});
