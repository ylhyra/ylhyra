import Sound from "datasets/sounds";

import { Request, Router } from "express";
const router = Router();

/*
  Returns audio file for a single input
*/
router.get("/GetOneAudioFile", async (req, res) => {
  const { text } = req.query;
  const file = await Sound(text);
  res.send({ file });
});
export default router;
