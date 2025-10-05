const { z } = require("zod");

const CreateUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string()
});

const SigninSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string(),
});

const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
});

const drawingSchema = z.object({
  type: z.enum(["OBJECT", "FLOWCHART"]),
  content: z.string(),
  roomId: z.string()
});

exports.CreateUserSchema = CreateUserSchema;
exports.SigninSchema = SigninSchema;
exports.CreateRoomSchema = CreateRoomSchema;
exports.drawingSchema = drawingSchema;