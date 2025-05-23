import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().email({ message: "Correo inválido" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    name: z
      .string()
      .min(3, {
        message: "El nombre debe tener al menos 3 caracteres.",
      })
      .max(200, {
        message: "El nombre debe tener menos de 200 caracteres.",
      }),
    last_name: z
      .string()
      .min(3, {
        message: "El apellido debe tener al menos 3 caracteres.",
      })
      .max(200, {
        message: "El apellido debe tener menos de 200 caracteres.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas deben coincidir",
    path: ["confirmPassword"],
  });
