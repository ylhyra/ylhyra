import { ErrorEnum } from "flashcards/errors";

export function throwError(message: ErrorEnum | null, status?: number) {
  // return res.status(status || 500).send({ error: message });
  throw { message, status };
}
