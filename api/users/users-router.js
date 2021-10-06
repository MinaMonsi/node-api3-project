const express = require('express');
// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// The middleware functions also need to be required
const {logger,
  validateUserId,
  validateUser,
  validatePost} = require('../middleware/middleware')

const router = express.Router();

router.get('/', (req, res, next) => {
   Users.get()
   .then(users => {
     res.json(users)
   })
   .catch(next)
});

router.get('/:id', validateUserId, (req, res, next) => {
  res.json(req.user)
});

router.post('/', validateUserId,(req, res) => {
Users.insert({ name: req.name })
.then(newUser =>{
  res.status(201).json(newUser)
})
.catch(next)
});

router.put('/:id', validateUserId,validateUser,(req, res, next) => {
  Users.update(req.params.id, { name: req.name })
  .then(() => {
    return Users.getById(req.params.id)
  })
  .then(user => {
    res.json(user)
  })
  .catch(next)
});

router.delete('/:id', validateUserId, async (req, res) => {
  try{
    await Users.remove(req.params.id)
    res.json(user)
  }catch(err){
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async(req, res,next) => {
  try{
    const result = await Users.getUserPosts(req.params.id)
    res.json(user)
   }catch(err){
     next(err)
   }
  
});

router.post('/:id/posts', validateUserId, validatePost, async(req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  try{
    const result = await Posts.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(result)
  } catch(err){
    next(err)
  }
});

//error handling router
router.use((err,req,res,next)=>{
  res.status(500).json({
    message: err.message
  })
})

// do not forget to export the router
module.exports = router
