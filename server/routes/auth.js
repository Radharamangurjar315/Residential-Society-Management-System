const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requiredLogin = require('../middlewares/requiredLogin');
const society = require('../models/society');

router.get('/protected', requiredLogin, (req, res,next) => {
    res.send("Hello Duniya");
});
router.get('/admin/dashboard',requiredLogin, (req,res,next)=>{
    res.send("Hello Admin");
})
router.get("/getUser", async (req, res) => {
    try {
        const user = await User.findById(req.user.id);  // Assuming token contains user ID
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});




router.post('/api/auth/signup', async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, phone, password, role, societyId } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !password || !societyId) {
            return res.status(422).json({ error: "Please fill in all required fields" });
        }

        // Check if society exists
        const society = await Society.findById(societyId);
        if (!society) {
            return res.status(404).json({ error: "Society not found" });
        }

        // Check if user with the same email or phone already exists in any society
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered in a society" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role, // Default role is "resident"
            societyId,  // Store society ID instead of society name
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

router.post('/api/auth/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
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