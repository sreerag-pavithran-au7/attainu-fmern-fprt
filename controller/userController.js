const User = require('../model/userModel');
const validateRegister = require('../validation/register');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateLogin = require('../validation/login');
require('dotenv').config()

const  userController ={};

// POST Method for Register

userController.register =  async (req, res, next) => {
    const { errors, isValid } = validateRegister(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const { email, password, name } = req.body;
  
    User.findOne({ email })
      .exec()
      .then(async (user) => {
        if (user) {
          res.status(409).json({ message: 'User with this email already exists' });
        } else {
            const userData =  await User.find().sort({userid:-1})
            if(userData.length == 0){
                seq = "USR001"        
            }else{
                let id = (Number(userData[0].userid.slice(3,7))+1).toString()
                let targetLength = 4-id.length
                let uid = id.padStart(targetLength, 0)
                seq = "USR"+uid
            }
          const newUser = new User({
            userid: seq,
            name,
            email,
            password,
          });
  
          bcrypt.hash(password, 10).then(hash => {
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.status(200).json(user))
              .catch(error => res.status(500).json(error));
          });
        }
      })
      .catch(err => res.status(500).json(err));
  };
  

  userController.login =  async (req, res, next) => {
    try {
      const { errors, isValid } = validateLogin(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email }).exec();
      if (!user) {
        return res.status(401).json({ message: 'Auth Failed' });
      }
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          process.env.SECRET,
          {
            expiresIn: '10h',
          }
        );
        return res.status(200).json({ message: 'Auth Successful', token });
      }
      res.status(401).json({ message: 'Auth Failed' });
    } catch (e) {
      throw new Error(e.message);
    }
  };

  userController.deleteUsr = async(req, res, next) => {
    User.findOneAndDelete({ _id: req.params.userId })
      .exec()
      .then(() => res.status(200).json({ message: 'User deleted' }))
      .catch(err => res.status(500).json(err));
  };
  
  userController.current = (req, res, next) => {
    return res.status(200).json(req.userData);
  };

  module.exports = userController;
