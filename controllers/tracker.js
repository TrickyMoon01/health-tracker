
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Weight = require('../models/weight.js')
const Plan = require('../models/plan.js')

// router logic will go here - will be built later on in the lab
router
.get('/', (req, res) => {
  console.log(res.locals.user)
  res.render('tracker/index.ejs',{user:res.locals.user});
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
        const newWeight = await Weight.create({weight:weight,user_id:user._id})
        console.log({newWeight})
        res.locals.user.weight_history.push({weight:weight})
        res.redirect(`/users/${user._id}/tracker`)
      }else{
        res.sendStatus(422)//wrong format
      }
    }else{
      res.sendStatus(401)//unauthorized
    }
  }catch(e){
    console.log(e.message)
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
        await Weight.findByIdAndUpdate(itemId,{$set:{weight:newWeight}})
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
    console.log(e.message)
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
    console.log(e.message)
    res.redirect('/')
  }
});

module.exports = router;
