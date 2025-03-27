const express = require('express')
const req = require('express/lib/request')
const res = require('express/lib/response')
const router = express.Router()
const mongoose = require('mongoose')
const { post } = require('./auth')
const requiredLogin = require('../middleware/reuqiredLogin')
const Post = mongoose.model("Post")




router.get('/allpost',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name email societyId")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,description, societyId, } = req.body
    if(!title || !body){
        return res.status(422).json({error:"Please add all the fields"})
    }
    // console.log(req.user)
    // res.send("OK")
    req.user.password = undefined
     const post = new Post({
         title,
         body,
         postedBy:req.user
     })
     post.save().then(result=>{
        res.json({post:result})
     })
     .catch(err=>{
        console.log(err)
     })
})

router.get('/mypost',requiredLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name email")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = router