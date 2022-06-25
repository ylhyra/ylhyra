import { t_Error } from "flashcards/errors";

export function throwError(message: t_Error | null, status?: number) {
  // return res.status(status || 500).send({ error: message });
  throw { message, status };
}
