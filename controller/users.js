const express = require('express');
const User = require('../models/User');
const validateRegisterInput = require('../validation/register');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateLoginInput = require('../validation/login');
const checkAuth = require('../middleware/check-auth');
require('dotenv').config()

const userRouter = express.Router();

// register the user
userRouter.post('/register', (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { email, password, name } = req.body;

  User.findOne({ email })
    .exec()
    .then(user => {
      if (user) {
        res
          .status(409)
          .json({ message: 'User with this email already exists' });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.hash(password, 10).then(hash => {
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.status(201).json(user))
            .catch(error => res.status(500).json(error));
        });
      }
    })
    .catch(err => res.status(500).json(err));
});
// login the user
userRouter.post('/login', async (req, res, next) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);
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
});
userRouter.delete('/:userId', (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.userId })
    .exec()
    .then(() => res.status(200).json({ message: 'User deleted' }))
    .catch(err => res.status(500).json(err));
});

userRouter.get('/current', checkAuth, (req, res, next) => {
  return res.status(200).json(req.userData);
});

module.exports = userRouter;
