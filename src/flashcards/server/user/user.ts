import type { Request } from "express";
import { StatusCodes } from "http-status-codes";
import { errors } from "flashcards/errors";
import { db } from "flashcards/server/database/db";
import { throwError } from "flashcards/server/functions/various";
import { UserId, Username } from "flashcards/frontend/user/types";
import { encodeDataInHtml } from "ylhyra/content/documents/compile/functions/functions";

export const getUserId = (req: Request): UserId | undefined => {
  return req.session!.userId;
};

export const setSession = (
  req: Request,
  userId: UserId,
  username: Username
) => {
  req.session!.userId = userId;
  req.session!.usernameEncoded = encodeDataInHtml(username, true);
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
