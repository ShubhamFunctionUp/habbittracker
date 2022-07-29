const express = require('express');
const router = express.Router();
const userController = require('../controller/user')
const habitController = require('../controller/habbit')
router.get('/',async function (req,res) {
    console.log("hello")
    res.send("hello")
})

router.post('/myHabits',habitController.createHabbit)
router.post('/myHabitsupdate',habitController.updateCheckList)
router.get('/getAllHabbits',habitController.getAllHabts)
router.get('/getMyHabbits',habitController.getMyHabbits)
router.get('/getSingleHabbits/:id',habitController.getSingleHabit)

router.post('/signup',userController.signup)
router.post('/login',userController.login)


module.exports = router