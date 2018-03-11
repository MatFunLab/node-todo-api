const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");


const todos = [
  {
    _id: new ObjectID(),
    text: "first test todo"
  },
  {
    _id: new ObjectID(),
    text: "second test todo"
  }
];
//call beforeEach to erase every todo in Todo collection but then populate with dummy data above
beforeEach((done) => {
  Todo.remove({}).then(() => {
  return Todo.insertMany(todos);
}).then(() => done());
});

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
