import type { Request } from "express";
import { throwError } from "flashcards/app/functions/sendError.server";
import { prisma } from "flashcards/database/database.server";
import { errors } from "flashcards/errors";
import { UserId, Username } from "flashcards/user/types";
import { StatusCodes } from "http-status-codes";
import { encodeDataInHtml } from "ylhyra/documents/compilation/compileDocument/functions/functions";

export function getUserId(req: Request): UserId | undefined {
  return req.session!.userId;
}

export function setSession(req: Request, userId: UserId, username: Username) {
  req.session!.userId = userId;
  req.session!.usernameEncoded = encodeDataInHtml(username);
}

export async function getUserIdFromUsername(username: Username) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { userId: true, username: true },
  });
  if (!user) throw new Error("No user with that name");
  return user.userId;
}

export function requireUserId(req: Request) {
  const userId = getUserId(req);
  if (userId) {
    return userId;
  } else {
    throwError(errors.ERROR_LOGIN_REQUIRED, StatusCodes.FORBIDDEN);
  }
}
