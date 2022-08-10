import { ErrorEnum } from "flashcards/errors";
import { Response } from "express";

export function sendError(
  message: ErrorEnum | null,
  status: number,
  res?: Response,
) {
  if (res) {
    res.status(status || 500).send({ error: message });
  } else {
    throw { message, status };
  }
}
