const path = require('path')
const express = require('express')
const morgen = require('morgan')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const passport = require('passport')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const exphbs = require('express-handlebars')

//Load config
dotenv.config({path: './config/config.env'})

//passport config
require('./config/passport')(passport)

//Database
connectDB()

const app = express();

//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//method override
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//logging
if(process.env.NODE_ENV == 'development') {
    app.use(morgen('dev'))   
}


//handlebar helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')
const { listenerCount } = require('./models/user')

//Handlebars
app.engine('.hbs', exphbs({ helpers: {
  formatDate,
  truncate,
  stripTags,
  editIcon, 
  select
}, defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URI
    })
  }))


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//setup middleware
app.use(function(req, res, next) {
  res.locals.user = req.user || null
  next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))