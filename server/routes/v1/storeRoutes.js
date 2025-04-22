const { loginStore } = require("../../controllers/storeController");

const storeRouter = require("express").Router();

storeRouter.post("/login", loginStore);

module.exports = storeRouter;
