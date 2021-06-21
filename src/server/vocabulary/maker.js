import express from "express";
import query from "server/database";
import shortid from "shortid";
import sql from "server/database/functions/SQL-template-literal";
import cors from "cors";
import { content_folder } from "paths";
const router = require("express").Router();
const fs = require("fs");

router.get("/vocabulary_maker", (req, res) => {
  res.sendFile(content_folder + "/not_data/vocabulary/vocabulary.json");
});

export default router;
