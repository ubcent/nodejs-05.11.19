const express = require("express");
const consolidate = require("consolidate");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:32768/tasks", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine("hbs", consolidate.handlebars);
app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "views"));

const Task = require("./models/mongo");

app.listen(3000, () => {
  console.log("запуск");
});

app.get("/", (req, result) => {
  Task.find({}).then(res => {
    let tasks = res.filter(todo => {
      return !todo.completed;
    });

    let doneTasks = res.filter(todo => {
      return todo.completed;
    });

    const taskList = {
      list: tasks,
      completedList: doneTasks
    };
    result.render("taskList", taskList);
  });
});

app.post("/addTask", async (req, res) => {
  console.log(req.body.title);
  const task = new Task(req.body);
  const savedTask = /* await */ task.save();

  const tasks = await Task.find({});
  console.log(tasks);
  const taskList = {
    list: tasks
  };

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  console.log(req.body);
  const id = req.body.id;

  const deletedTask = await Task.findByIdAndRemove(id);
  const tasks = await Task.find({});
  const taskList = {
    list: tasks
  };

  res.redirect("/");
});

app.post("/completed", async (req, res) => {
  let id = req.body.id;
  Task.findById(id)
    .exec()
    .then(result => {
      result.completed = !result.completed;
      return result.save();
    })
    .then(res.redirect("/"));
  console.log(id);
});
