const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requiredLogin = require('../middlewares/requiredLogin');

router.get('/protected', requiredLogin, (req, res,next) => {
    res.send("Hello Duniya");
});

router.post('/signup', (req, res) => {
    console.log(req.body);
    const { name, email, password, role} = req.body;
    if (!email || !password || !name || !role) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    User.findOne({ email : email })
    .then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with that email" });  
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword => {
            const user = new User({
                email,
                password: hashedpassword,
                name,
                role
            });
            user.save()
                .then(user => {
                    res.json({ message: "Saved successfully" });
                })
                .catch(err => {
                    console.log(err);
                });   
        })
         // save the user to the database catch ends here
        }
    )
    .catch(err => {
        console.log(err);
    });
});
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password || !role){
    return res.status(422).json({error:"Please enter the email or password"})
  }
  User.findOne({email:email})
  .then(savedUser=>{
    if(!savedUser){
      return res.status(422).json({error:"Invalid email or password"})
  }
  bcrypt.compare(password, savedUser.password)
  .then(doMatch=>{
  if(doMatch){
//    res.json({message:"Successfully Signed in"})
    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
    const {_id,name,email,role}=savedUser
    res.json({token,user:{_id,name,email,role}})
  }
  else{
    return res.status(422).json({error:"Inavalid email or password"})
  }
  })
  .catch(err=>{
    console.log(err)
  })
})
})

module.exports = router;