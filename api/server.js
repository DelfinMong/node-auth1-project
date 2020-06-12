const express = require("express");
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const helmet = require("helmet");
const cors = require("cors");

const usersRouter = require("../users/user-router.js");
const authRouter = require("../auth/auth-router.js");

const sessionConfig = {
    name: "user-session",
    secret: "secretsdontmakefriends",
    cookie: {
        maxAge: 3600 * 1000,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,

    store: new knexSessionStore (
        {
            knex: require("../data/db.config.js"),
            tablename: "sessions",
            sidfilename: "sid",
            createtable: true,
            clearInterval: 3600 * 1000
        }
    )
}



const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users",usersRouter);
server.use("/api/auth",authRouter);

server.get("/", (req, res) => {
    res.json({ api: "up" });
  });
  
  module.exports = server;