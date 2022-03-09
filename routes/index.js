const express = require('express')
const router = express.Router()
const {  ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/story')

//@desc Login?Landing Page
//@route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('Login', {
        layout: 'login',
    })
})

//@desc Dashboard
//@route GET /Dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard',{
            name: req.user.firstName,
            stories
        })   
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
       
})


module.exports = router
