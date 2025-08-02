
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Weight = require('../models/weight.js')
const Plan = require('../models/plan.js')

// router logic will go here - will be built later on in the lab
router
.get('/', (req, res) => {
  res.render('tracker/index.ejs', {user:res.locals.user});
})


router
.get('/weight', async (req, res) => {
    res.render('tracker/new_weight.ejs', {
        user: req.session.user,
    });
})
.post('/weight', async (req, res) => {
  try{
    const user = req.session.user;
    if(user){
      const weight = Number(req.body.weight);
      if(weight){
        const newWeight = await Weight.create({weight:weight, user_id:user._id})
        res.locals.user.weight_history.push({_id:newWeight._id, weight:weight})
        res.redirect(`/users/${user._id}/tracker`)
      }else{
        res.sendStatus(422)//wrong format
      }
    }else{
      res.sendStatus(401)//unauthorized
    }
  }catch(e){
    res.redirect('/')
  }
})
.get('/:itemId/edit_weight', async (req, res) => {
  const itemId = req.params.itemId
  const item = await Weight.findById(itemId);
  if(item){
    res.render('tracker/edit_weight.ejs', {
        user: req.session.user,
        item:item
    });
  }else{
    res.sendStatus(404)
  }
})
.put('/:itemId/edit_weight', async (req, res) => {
   try{
    const user = req.session.user;
    if(user){
      const itemId = req.params.itemId;
      const newWeight = req.body.weight
      if(itemId){
        await Weight.findByIdAndUpdate(itemId, {$set:{weight:newWeight}})
        const index = res.locals.user.weight_history.findIndex(item=>item._id === itemId)
        res.locals.user.weight_history[index].weight = newWeight
        res.redirect(`/users/${user._id}/tracker`)
      }else{
        res.sendStatus(422)//wrong format
      }
    }else{
      res.sendStatus(401)//unauthorized
    }
  }catch(e){
    res.redirect('/')
  }
})
.delete('/:itemId/weight', async (req, res) => {
   try{
    const user = req.session.user;
    if(user){
      const itemId = req.params.itemId;
      if(itemId){
        await Weight.deleteOne({_id:itemId})
        res.locals.user.weight_history = res.locals.user.weight_history.filter(item=>item._id !== itemId)
        res.redirect(`/users/${user._id}/tracker`)
      }else{
        res.sendStatus(422)//wrong format
      }
    }else{
      res.sendStatus(401)//unauthorized
    }
  }catch(e){
    res.redirect('/')
  }
});
router
.get('/plan', async (req, res) => {
    res.render('tracker/new_plan.ejs', {
        user: req.session.user,
    });
})
.post('/plan', async (req, res) => {
  try{
    const user = req.session.user;
    if(user){
      const exercise = req.body.exercise;
      const repetitions = Number(req.body.repetitions);
      const sets = Number(req.body.sets);
      const status = req.body.status||'not finished';
      if(exercise && repetitions && sets){
        const newPlan = await Plan.create({exercise, repetitions, status, sets})
        res.locals.user.plan_history.push(newPlan)
        res.redirect(`/users/${user._id}/tracker`)
      }else{
        res.sendStatus(422)//wrong format
      }
    }else{
      res.sendStatus(401)//unauthorized
    }
  }catch(e){
    res.redirect('/')
  }
})
.get('/:itemId/edit_plan', async (req, res) => {
  const itemId = req.params.itemId
  const item = await Plan.findById(itemId);
  if(item){
    res.render('tracker/edit_plan.ejs', {
        user: req.session.user,
        item:item
    });
  }else{
    res.sendStatus(404)
  }
})
.put('/:itemId/edit_plan', async (req, res) => {
   try{
    const user = req.session.user;
    if(user){
      const itemId = req.params.itemId;
      const exercise = req.body.exercise
      const repetitions = req.body.repetitions
      const sets = req.body.sets
      const status = req.body.status||'not finished'
      if(itemId && status && repetitions && exercise){
        await Plan.findByIdAndUpdate(itemId,{$set:{exercise:exercise, repetitions:repetitions, status:status, sets:sets}})
        const index = res.locals.user.plan_history.findIndex(item=>item._id === itemId)
        res.locals.user.plan_history[index] = {_id:itemId, exercise, repetitions, status, sets}
        res.redirect(`/users/${user._id}/tracker`)
      }else{
        res.sendStatus(422)//wrong format
      }
    }else{
      res.sendStatus(401)//unauthorized
    }
  }catch(e){
    res.redirect('/')
  }
})
.delete('/:itemId/plan', async (req, res) => {
   try{
    const user = req.session.user;
    if(user){
      const itemId = req.params.itemId;
      if(itemId){
        await Plan.deleteOne({_id:itemId})
        res.locals.user.plan_history = res.locals.user.plan_history.filter(item=>item._id !== itemId)
        res.redirect(`/users/${user._id}/tracker`)
      }else{
        res.sendStatus(422)//wrong format
      }
    }else{
      res.sendStatus(401)//unauthorized
    }
  }catch(e){
    res.redirect('/')
  }
});

module.exports = router;
