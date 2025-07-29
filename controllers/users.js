const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req, res) => {
  const users = await User.find({},'-password')
  res.render('users/index.ejs', {
    users: users,
    user:req.session.user
  });
});
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId
    if(userId){
      const guest = await User.findById(userId,'-password').populate('pantry')
      res.render('users/show.ejs', {
        guest: guest,
        user:req.session.user
      });
    }else{
      res.sendStatus(404)
    }
});

module.exports = router;
