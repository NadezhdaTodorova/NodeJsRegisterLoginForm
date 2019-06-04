const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

// Login page
router.get('/login', (req,res) => res.render('login'));

// Register page 
router.get('/register', (req,res) => res.render('register'));

//Register handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];
    
    //check required fields
    if(!name || !email || !password || !password2 ){
       errors.push({msg: 'Please fill in all fields'});
    }
    
    //Check passwords match 
    if(password !== password2){
       errors.push({msg: 'Passwords do not match'})
    }
    
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }else {
        User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
});


module.exports = router;