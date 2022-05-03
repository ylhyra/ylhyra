import type { Request } from "express";
import { db } from "flashcards/database/database.server";
import { errors } from "flashcards/errors";
import { throwError } from "flashcards/functions/sendError.server";
import { UserId, Username } from "flashcards/user/types";
import { StatusCodes } from "http-status-codes";
import { encodeDataInHtml } from "ylhyra/documents/compilation/compileDocument/functions/functions";

export const getUserId = (req: Request): UserId | undefined => {
  return req.session!.userId;
};

export const setSession = (
  req: Request,
  userId: UserId,
  username: Username
) => {
  req.session!.userId = userId;
  req.session!.usernameEncoded = encodeDataInHtml(username);
};

export const getUserIdFromUsername = async (username: Username) => {
  const user = await db.user.findUnique({
    where: { username },
    select: { userId: true, username: true },
  });
  if (!user) throw new Error("No user with that name");
  return user.userId;
};

export const requireUserId = (req: Request) => {
  const userId = getUserId(req);
  if (userId) {
    return userId;
  } else {
    throwError(errors.ERROR_LOGIN_REQUIRED, StatusCodes.FORBIDDEN);
  }
};