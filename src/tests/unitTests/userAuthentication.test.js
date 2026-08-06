import argon2 from "argon2";
import query from "server/database";
import { authenticate_user } from "server/user/authenticate";

jest.mock("server/database", () => jest.fn());
jest.mock("argon2", () => ({
  verify: jest.fn(),
}));

const user = {
  id: 12,
  username: "test-user",
  password: "$argon2id$stored-hash",
};

beforeEach(() => {
  query.mockReset();
  argon2.verify.mockReset();
});

test("accepts the password only after Argon2 verifies it", async () => {
  query.mockImplementation((_statement, callback) => callback(null, [user]));
  argon2.verify.mockResolvedValue(true);

  await expect(
    authenticate_user({ username: user.username, password: "correct" })
  ).resolves.toEqual({ user });
  expect(argon2.verify).toHaveBeenCalledWith(user.password, "correct");
});

test("rejects an incorrect password", async () => {
  query.mockImplementation((_statement, callback) => callback(null, [user]));
  argon2.verify.mockResolvedValue(false);

  await expect(
    authenticate_user({ username: user.username, password: "incorrect" })
  ).resolves.toEqual({ error: "ERROR_INCORRECT_PASSWORD" });
});

test("reports a missing user without attempting password verification", async () => {
  query.mockImplementation((_statement, callback) => callback(null, []));

  await expect(
    authenticate_user({ username: "missing", password: "anything" })
  ).resolves.toEqual({ error: "ERROR_USERNAME_DOES_NOT_EXIST" });
  expect(argon2.verify).not.toHaveBeenCalled();
});

test("propagates database and malformed-hash errors", async () => {
  const database_error = new Error("database unavailable");
  query.mockImplementationOnce((_statement, callback) =>
    callback(database_error)
  );

  await expect(
    authenticate_user({ username: user.username, password: "password" })
  ).rejects.toBe(database_error);

  const verification_error = new Error("invalid hash");
  query.mockImplementationOnce((_statement, callback) =>
    callback(null, [user])
  );
  argon2.verify.mockRejectedValueOnce(verification_error);

  await expect(
    authenticate_user({ username: user.username, password: "password" })
  ).rejects.toBe(verification_error);
});
