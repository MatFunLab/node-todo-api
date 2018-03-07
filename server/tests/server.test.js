const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");

//call beforeEach to erase every todo in Todo collection 
beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe("POST /todos", () => {
  it("Should create a new todo and verify that is inserted correctly in the database", (done) => {
    var text = "new todo";
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
      Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0); //expecting todos array is 0
        done();
      }).catch((e) => done(e)); // if there is saved todo printing error message
    });
  }); //second it ends here
});
