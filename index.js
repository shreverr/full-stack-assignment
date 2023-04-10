const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const jsonParser = bodyParser.json();

const USERS = [{ email: "test@gmail.com", password: "test123", access: "admin"}];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

let testCode = () => {
  return Math.random() < 0.5;
}

const SUBMISSION = [
  {
    code: "print(Hello World)"
  }
];

app.post('/signup', jsonParser, function(req, res) {
  let userExists = false;

  for (const user of USERS) {
    if(user.email === req.body.email){
      userExists = true;
      break;
    }
  }

  if(!userExists){
    let user = {
      email: req.body.email,
      password: req.body.password
    }
  
    USERS.push(user);
  }

  res.status(200);
  res.send("User saved");
});

app.post('/login', jsonParser, function(req, res) {
  let userExists = false;

  for (const user of USERS) {
    if(user.email === req.body.email){
      userExists = true;
      break;
    }
  }

  if(userExists){
    const token = "exampletoken";
    let passwordMatched = false;

    for (const user of USERS) {
      if(user.password === req.body.password){
        passwordMatched = true;
        break;
      }
    }

    if(passwordMatched){
      res.status(200);
      res.send(token);
    } else {
      res.status(401);
      res.send("Wrong Password");
    }

  } else {
    res.status(401);
    res.send("User does not exists");
  }
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
  res.json(SUBMISSION);
});


app.post("/submissions", jsonParser, function(req, res) {
  let submitedCode = req.body.code;

  if(testCode(submitedCode)){
    res.send("Solution Accepted");
  } else {
    res.send("Solution Rejected");
  }

  SUBMISSION.push({code: submitedCode});
});

app.post('/add-new-problem', jsonParser, (req, res) => {

  if(req.body.access === "admin"){
    let newProblem = {
      title: req.body.title,
      description: req.body.description,
      testCases: req.body.testCases
    }
    QUESTIONS.push(newProblem);
    res.send("Problem added successfully")
  } else {
    res.send("You are not an admin. Only admins can add new problems");
  }

  console.log(QUESTIONS);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
});