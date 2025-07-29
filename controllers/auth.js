const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    const userInDataBase = await User.findOne({ username: req.body.username });

    if (userInDataBase) {
        return res.send('username already taken');
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Password and Confirm password must match');
    }
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    // hashedPassword is holding the value that comes back from bcrypt running a hashSync method on the password
    
    const user = await User.create(req.body);

    res.send(`Thanks for signing up ${user.username}`);
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
    const userInDataBase = await User.findOne({ username: req.body.username }).populate('pantry');

    if (!userInDataBase) {
        return res.send('Login failed. Please try again.');
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDataBase.password);

    if (!validPassword) {
        return res.send('Login failed. Please try again.')
    }

    req.session.user = userInDataBase


    res.redirect('/');
});

router.get('/sign-out', (req, res) => {
    req.session.destroy()
    res.redirect('/');
});

module.exports = router;