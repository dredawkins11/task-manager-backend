const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { Task, validate } = require("../models/task");

//PROTECTED ROUTES

router.get("/user", authenticateAccessToken, async (req, res) => {
  /* Request the tasks that belong to a specific user */

    const tasks = await Task.find({ userId: req.user.id });
    res.jsonp(tasks);
});

//GENERAL ROUTES

router.post("/", async (req, res) => {
  /* Create a task in the database */

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let task = new Task({
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId,
      createdAt: req.body.createdAt,
    });

    task = await task.save();
    res.send(task);
});

router.put("/:id", async (req, res) => {
  /* Update a task in the database */

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        completed: req.body.completed,
      },
      { new: true, useFindAndModify: false }
    );
    if (!task) return res.status(404).send("No task with that id.");

    res.send(task);
});

router.delete("/:id", async (req, res) => {
  /* Delete a task from database */

    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).send("No task with that id.");
    res.send(task);
});

function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send(err);
    req.user = user;
    next();
  });
}

module.exports = router;
