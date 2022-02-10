const express = require('express');
const router = express.Router();

require('../conn')
const User = require('../model/userSchema')
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
          if(!userLogin) {
            res.status(400).json({error: 'user error'})
        }
        else{
              res.json({message: "user loggedin"})

          }

      } catch (error) {
          
      }
  })


  module.exports = router;