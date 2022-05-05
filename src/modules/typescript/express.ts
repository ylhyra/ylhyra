import { Response } from "express";
import { Send } from "express-serve-static-core";

export interface TypedResponse<T> extends Response {
  send: Send<T, this>;
}
