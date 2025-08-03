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
        return res.send('Username is already taken. <a href="/auth/sign-up">Please try again.</a>');
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.send('Password and Confirm Password must match. <a href="/sign-up">Please try again.</a>');
    }
    
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    // hashedPassword is holding the value that comes back from bcrypt running a hashSync method on the password
    
    const user = await (await User.create(req.body)).toObject()

    req.session.user = {...user,weight_history:[],plan_history:[]}

    res.redirect('/');
});

router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
    const userInDataBase = await User.findOne({ username: req.body.username }).populate('weight_history').populate('plan_history');

    if (!userInDataBase) {
        return res.send('Login failed. <a href="/auth/sign-in">Please try again.</a>');
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDataBase.password);

    if (!validPassword) {
        return res.send('Login failed. <a href="/sign-in">Please try again.</a>')
    }

    req.session.user = userInDataBase


    res.redirect('/');
});

router.get('/sign-out', (req, res) => {
    req.session.destroy()
    res.redirect('/');
});

module.exports = router;