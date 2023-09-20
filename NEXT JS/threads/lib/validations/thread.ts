import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(6, { message: "minimum 6 characters required" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(6, { message: "minimum 6 characters required" }),
  // accountId: z.string(),
});
