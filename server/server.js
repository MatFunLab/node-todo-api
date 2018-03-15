var env = process.env.NODE_ENV || "development";
console.log("------------ " + env + " --------------");
  if(env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
  } else if(env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
  }

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const port = process.env.PORT;
var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get("/todos", (req, res) => {
  Todo.find().then((todos) => {
    res.send({
      todos
    });
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get("/todos/:id", (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(404).send("Status 404: id is not valid");
  }
  Todo.findById(id).then((todo) => {
    if(!todo) {
    return res.status(404).send("Todo is not found");
    }
    res.send({todo});

  }).catch((e) => {
    res.status(400).send("Problem with communication with server");
  });
  });

  app.delete("/todos/:id", (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
      return res.status(404).send("Status 404: Todo is not valid");
    }
    Todo.findByIdAndRemove(id).then((todo) => {
      if(!todo) {
        return res.status(404).send("Selected todo to erase is not found");
      }
      res.send({todo}); // same as {todo: todo}
    }).catch((e) => {
      res.status(400).send("Problem with communication with server");
    });
  });

app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ["text", "completed"]);
  if(!ObjectID.isValid(id)) {
    return res.status(404).send("Status 404: Todo is not valid");
  }
        //if completed property is boolean and if its value is true
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime(); // returns time in milisec
  }else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo) => {
    if(!todo) {
      res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
