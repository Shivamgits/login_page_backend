const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('../conn')
const User = require('../model/userSchema')
const authenticate = require('../middleware/authenticate')
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.get('/',(req, res) => {
    res.send("hello router")
  })
// router.post('/register', (req, res) => {
//     const {name,email,phone,work,password,cpassword} = req.body
//    if ( !name || !email || !phone || !work || !password || !cpassword) {
//        return res.status(422).json({error: 'fill every data'})
//    }
//   User.findOne({email: email, phone: phone})
//   .then((userExists) => {
//       if(userExists) {
//           return res.status(422).json({error: 'user already exists'})
//       }
//       const user = new User({name,email,phone,work,password,cpassword})
//       user.save().then(() => {
//           res.status(201).json({message: "registered successfully"})
//       }).catch(err => {
//           res.status(500).json({error: "failed to register"})
//       })
//     }).catch(err => {console.log(err)});
//   })

router.post('/register', async (req, res) => {
    const {name,email,phone,work,password,cpassword} = req.body
   if ( !name || !email || !phone || !work || !password || !cpassword) {
       return res.status(422).json({error: 'fill every data'})
   }


   try {
    const userExists = await User.findOne({email: email, phone: phone})
    
        if(userExists) {
            return res.status(422).json({error: 'user already exists'})
        }
        else if(password != cpassword){
          return res.status(422).json({error: 'password are not matching'})
        }
        else{
          const user = new User({name,email,phone,work,password,cpassword})
          //before giving data to database we write bcrypt code
        const userRegister= await user.save()
        
      if(userRegister){
        res.status(201).json({message: "registered successfully"})
      }
      else{
        res.status(500).json({error: "failed to register"}) 
      }
        
        }
     

      
   } catch (error) {
    console.log(err)
   }
 
  })


  //sign in

  router.post('/signin',async(req, res) =>{
     
      try {
          const {email, password} = req.body;
          if(!email || !password) {
              return res.status(400).json({error: 'fill all data'})
          }
          
          const userLogin = await User.findOne({email: email});
         if(userLogin) {
          //  console.log(password)
          //  console.log(userLogin.password)
          const isMatch = await bcrypt.compare(password, userLogin.password)
         //jwt
         const token = await userLogin.generateAuthToken() ;
         console.log(token)

         res.cookie("jwtoken",token,{
           expires: new Date(Date.now() + 25892000000),
           httpOnly: true
         })
          if(!isMatch) {
            res.status(400).json({error: 'Invalid Credentials1'})
        }
        else{
              res.json({message: "user loggedin"})

          }
         } else {
          res.status(400).json({error: 'Invalid Credentials2'})
         }
         

      } catch (error) {
          console.error(error)
      }
  })


  router.get('/about',authenticate,(req, res) => {
    console.log("hello about")
    res.send(req.rootUser)
  })
  //get user data for contact us
  router.get('/getdata',authenticate,(req, res) => {
   console.log("hello contact")
    res.send(req.rootUser)
  })


  module.exports = router;