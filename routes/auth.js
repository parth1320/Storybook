const express = require('express')
const passport = require('passport')

const router = express.Router()

//@desc auth with google
//@route GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@desc Google auth callback
//@route GET /GET/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }) , 
(req, res) => {
    res.redirect('/dashboard')
})

//@desc Logout user
//@Route /auth/logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
})

module.exports = router