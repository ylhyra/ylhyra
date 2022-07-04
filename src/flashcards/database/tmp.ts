import { db } from "flashcards/database/database.server";

export function test() {
  const updatedApprentice = db.apprentice.update({
    where: {
      apId: Number(req.params.id),
    },
    data: {
      gender: {
        update: {
          geId: req.body.apprentice.gender,
        },
      },
      apFirstname: req.body.apprentice.firstName,
      apLastname: req.body.apprentice.lastName,
      apBirthdate: new Date(req.body.apprentice.birthdate),
      apPhoneNumber: req.body.apprentice.phoneNumber,
      execution: {
        update: {
          exDate: req.body.execution.datetime,
          exMessage: req.body.execution.message,
          reId: req.body.region,
        },
      },
    },
  });
}
