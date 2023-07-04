const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const User = [];
const Admin = [];

const Questions = [{
  title:"two sum",
  description:"Given an array, find the pair of number with the sum equal to thegiven of numbers",
  testCases:[{
    input:"[1,2,3,4,5,6]",
    output:"5"
  }]
}]

const Submission = [
  {
    userId:"1",
    questionId:"1",
    code:"function max(arr) {return Math.max(...arr)}",
    status:"accepted"
  },{
    userId:"1",
    questionId:"1",
    code:"function max(arr) {return Math.min(...arr)}",
    status:"rejected"
  }
]

app.post('/singup', (req, res) => {
  const{email,password} = req.body;
  if(email && password){
    User.push({email,password})
    res.status(201).send(`new user was created with email ${email} and password ${password}`)
  }else if(!email){
    res.status(404).send("Please enter the email");
  }else if(!password){
    res.status(404).send("Please Enter the password");
  }else{
    res.status(404).send("Please Enter the fields");
  }
  const StringEmail = String(email);
  if (StringEmail.search("@admin")){
    Admin.push({email,password})
  }
})

function generateToken() {
  // Generate a random token here
  return 'randomToken';
}

// Middleware function to check if the user is an admin
function isAdmin(req, res, next) {
  if (!req.user) {
    return res.redirect("/");
  }
  if (req.user.role === "admin") {
    // User is admin, give access to the page
    return next();
  }else{
    // Redirect to homepage for non-admin users
    return res.redirect("/");
  }
}




app.post('/login', (req, res) => {

  const{email,password} = req.body;
  const user = User.find(user => user.email === email);
  if(user && user.password === password){
     const token = generateToken()
     res.status(200).send({token})
  }else{
    res.status(401).send("User is not authenticated");
  }    
})

app.get('/questions', (req, res) => {
  //return the user all the questions in the questions array
  
  res.json(Questions);

})

app.get('/submissions/:quesId/:userId', (req, res) => {
 // return the users submissions for this problem
 const quesId=req.params.quesId;
 const userId=req.params.userId;
 let history=[];
 let attempts=1;

 SUBMISSION.forEach(submission=>{
  // If the userId and quesId matches then store the submission history in array
  if(submission.userId===userId && submission.quesId===quesId){
    history.push({
      attempt: attempts,
      code: submission.code,
      status: submission.status
    });
    attempts++;
  }
 })
 res.json("Submission History",history);
})
app.post('/submissions', (req, res) => {
  // let the user submit a problem, randomly accept or reject the solution
  let quesStatus = Math.floor(Math.random()*2);

  const {quesId,userId}  =  req.params;
  const {code} = req.body;

  // Store the submission in the SUBMISSION array above
  let userSub={
   quesId: req.params.quesId,
   userId: req.params.userId,
   code: req.body.code,
   status: quesStatus?"Solved":"Not completed"
  }
  SUBMISSION.push(userSub);

  res.status(200).json("Succesfully submitted!",userSub);
})
 
app.post("/addQuestion",isAdmin,(req,res)=>{
  // Random no for question id
  const randomNum = Math.floor(Math.random() * 1000);
  // Store the new question into the array
  const newQuestion={
    title: req.body.title,
    description: req.body.description,
    quesId: req.body.titl+randomNum,
    testCases: req.body.testCases
  }
  QUESTIONS.push(newQuestion);
  return res.status(200).json("New question added!",newQuestion);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})