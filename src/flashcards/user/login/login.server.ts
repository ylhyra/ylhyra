import argon2 from "argon2";
import { Request, Response, Router } from "express";
import { sendError } from "flashcards/app/functions/sendError.server";
import { prisma } from "flashcards/database/database.server";
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

router.post("/api/login", (req: Request<{}, {}, LoginRequest>, res) => {
  new Login(req, res);
});

class Login {
  username: string;
  email?: string;
  password: string;
  isLoginOrSignup: string;

  constructor(public req: Request<{}, {}, LoginRequest>, public res: Response) {
    this.username = req.body.username?.trim().replace(/\s+/g, " ");
    this.email = req.body.email?.trim();
    this.password = req.body.password;
    this.isLoginOrSignup = req.body.isLoginOrSignup;

    if (!this.username) {
      sendError(
        errors.LOGIN_FORM_USERNAME_REQUIRED,
        StatusCodes.BAD_REQUEST,
        res,
      );
    } else if (!this.password) {
      sendError(
        errors.LOGIN_FORM_PASSWORD_REQUIRED,
        StatusCodes.BAD_REQUEST,
        res,
      );
    } else if (this.isLoginOrSignup === "login") {
      void this.login();
    } else if (this.isLoginOrSignup === "signup") {
      void this.createUser();
    } else {
      res.send({ error: "Missing parameter `isLoginOrSignup`" });
    }
  }

  login = async () => {
    const user = await prisma.user.findUnique({
      where: { username: this.username },
      select: { userId: true, username: true, password: true },
    });

    if (!user) {
      sendError(
        errors.LOGIN_FORM_USERNAME_DOES_NOT_EXIST,
        StatusCodes.UNAUTHORIZED,
        this.res,
      );
    } else if (!(await argon2.verify(user.password, this.password))) {
      sendError(
        errors.LOGIN_FORM_INCORRECT_PASSWORD,
        StatusCodes.UNAUTHORIZED,
        this.res,
      );
    } else {
      this.loginSuccessful(user);
    }
  };

  checkIfUserExists = async (): Promise<boolean> => {
    const user = await prisma.user.findUnique({
      where: { username: this.username },
      select: { userId: true, username: true, password: true },
    });
    if (user) {
      sendError(
        errors.LOGIN_FORM_USERNAME_EXISTS,
        StatusCodes.CONFLICT,
        this.res,
      );
    }
    return Boolean(user);
  };

  createUser = async () => {
    if (!(await this.checkIfUserExists())) {
      const user = await prisma.user.create({
        data: {
          username: this.username,
          password: await argon2.hash(this.password),
        },
      });
      // TODO Error handling
      if (user) {
        this.loginSuccessful(user);
      } else {
        sendError(null, StatusCodes.INTERNAL_SERVER_ERROR, this.res);
      }
    }
  };

  loginSuccessful = (user: LoginResponse) => {
    const { userId, username } = user;
    setSession(this.req, userId, username);
    return this.res.send({ userId, username });
  };
}

router.post("/api/logout", (req, res) => {
  req.session!.userId = null;
  req.session!.usernameEncoded = null;
  return res.sendStatus(200);
});

// eslint-disable-next-line import/no-default-export
export default router;
