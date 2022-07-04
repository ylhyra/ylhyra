import argon2 from "argon2";
import type { Request, Response } from "express";
import { Router } from "express";
import { throwError } from "flashcards/app/functions/sendError.server";
import { db } from "flashcards/database/database.server";
import { errors } from "flashcards/errors";
import { setSession } from "flashcards/user/login/user.server";
import { StatusCodes } from "http-status-codes";

const router = Router();

export type LoginRequest = {
  username: string;
  email?: string;
  password: string;
  isLoginOrSignup: "login" | "signup";
};

export type LoginResponse = {
  userId: string;
  username: string;
};

router.post("/api/login", async (req: Request<{}, {}, LoginRequest>, res) => {
  const username = req.body.username?.trim().replace(/\s+/g, " ");
  const email = req.body.email?.trim();
  const { password, isLoginOrSignup } = req.body;

  if (!username) {
    return throwError(
      errors.LOGIN_FORM_USERNAME_REQUIRED,
      StatusCodes.BAD_REQUEST
    );
  }
  if (!password) {
    return throwError(
      errors.LOGIN_FORM_PASSWORD_REQUIRED,
      StatusCodes.BAD_REQUEST
    );
  }

  if (isLoginOrSignup === "login") {
    await login({ username, password, req, res });
  } else if (isLoginOrSignup === "signup") {
    await createUser({ email, username, password, req, res });
  } else {
    res.send({ error: "Missing parameter `isLoginOrSignup`" });
  }
});

const login = async ({
  username,
  password,
  req,
  res,
}: {
  username: string;
  password: string;
  req: Request;
  res: Response;
}) => {
  const user = await db.user.findUnique({
    where: { username: username },
    select: { userId: true, username: true, password: true },
  });

  if (!user) {
    throwError(
      errors.LOGIN_FORM_USERNAME_DOES_NOT_EXIST,
      StatusCodes.UNAUTHORIZED
    );
  } else if (!(await argon2.verify(user.password, password))) {
    throwError(errors.LOGIN_FORM_INCORRECT_PASSWORD, StatusCodes.UNAUTHORIZED);
  } else {
    loginSuccessful(req, res, user);
  }
};

export const checkIfUserExists = async ({
  email,
  username,
  res,
}: {
  username: string;
  email?: string;
  res: Response;
}) => {
  const user = await db.user.findUnique({
    where: { username: username },
    select: { userId: true, username: true, password: true },
  });
  if (user) {
    throwError(errors.LOGIN_FORM_USERNAME_EXISTS, StatusCodes.CONFLICT);
  }
};

const createUser = async ({
  username,
  email,
  password,
  req,
  res,
}: {
  username: string;
  password: string;
  email?: string;
  req: Request;
  res: Response;
}) => {
  await checkIfUserExists({ email, username, res });
  const user = await db.user.create({
    data: { username, password: await argon2.hash(password) },
  });
  // TODO Error handling
  if (user) {
    loginSuccessful(req, res, user);
  } else {
    throwError(null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

const loginSuccessful = (req: Request, res: Response, user: LoginResponse) => {
  const { userId, username } = user;
  setSession(req, userId, username);
  return res.send({ userId, username });
};

router.post("/api/logout", (req, res) => {
  req.session!.userId = null;
  req.session!.usernameEncoded = null;
  return res.sendStatus(200);
});

export default router;