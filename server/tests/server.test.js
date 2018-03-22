const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {todos, populateTodos} = require("./seed/seed");
const {users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
//call beforeEach to erase every todo in Todo collection but then populate with dummy data above
beforeEach(populateTodos);


describe("POST /todos", () => {
  it("Should create a new todo and verify that is inserted correctly in the database", (done) => {
    var text = "test todo";
    request(app)
    .post("/todos")
    .send({text})
    .expect(200)
    .expect((res) => {
        expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      //checking database(we entered one todo so is it one added to db)
      //and is the text property of that one todo object equal to our text
      //property we set above
      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    });
  }); //it ends here

  it("Should not create todo with invalid body data", (done) => {
    request(app)
    .post("/todos")
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2); //expecting todos array is 0
        done();
      }).catch((e) => done(e)); // if there is saved todo printing error message
    });
  }); //second it ends here
});

describe("GET /todos", () => {
  it("Should return all todos", (done) => {
    request(app)
    .get("/todos")
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  }); // third it ends here
});

describe("GET /todos/:id", () => {
  it("Should return todo doc", (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  it("Should return 404 if todo is not found", (done) => {
    var todo = {
      _id: new ObjectID(),
      text: "Test text"
    };
    request(app)
    .get(`/todos/${todo._id.toHexString()}`)
    .expect(404)
    .end(done);
  });
  it("Should return 404 for invalid objectIDs", (done) => {
    request(app)
    .get("/todos/546svgd")
    .expect(404)
    .end(done);
  });
});

describe("DELETE /todos/:id", () => {
  it("Should delete todo by id", (done)=> {
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      Todo.findById(todos[0]._id.toHexString()).then((todo) =>{
        expect(todo).toNotExist();
        done();
      }).catch((e) => done(e));
    });
  });
  it("Should return 404 if todo is not found", (done) => {
    var id = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${id}`)
    .expect(404)
    .end(done);

  });
  it("Should return 404 if todo id is not valid", (done) => {
    request(app)
    .delete("/todos/456")
    .expect(404)
    .end(done);
  });
});

describe("PATCH /todos/:id", () => {
  it("Should update the todo", (done) => {
    var id = todos[1]._id.toHexString();
     var text = "new test text";
    request(app)
    .patch(`/todos/${id}`)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA("number");
    })
    .end(done)
  });

  it("Should clear the completedAt when todo is not updated", (done) => {
    var id = todos[1]._id.toHexString();
    var text = todos[1].text;
    request(app)
    .patch(`/todos/${id}`)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done)
  });
});
