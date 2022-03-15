const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const uuid = require('uuid').v4;
const bodyParser = require('body-parser');
const multer = require('multer');
const Video =  require('./models/video')
const path = require('path');



const storage = multer.diskStorage({
  destination:  (req, file, cb)=>{
    cb(null, 'uploads');
    
  },
  filename: (req, file, cb) =>{
    const ext = path.extname(file.originalname);
    
    const id = uuid();
    const filePath = `videos/${id}${ext}`;
    Video.create({ filePath})
    .then(()=>{
      cb(null, filePath);
    });
    
  }
})


const upload = multer({ storage});

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.post('/upload', upload.single('avatar'),(req,res) =>{
  res.redirect('/edit');
});
app.get('/edit', (req,res) =>{
  Video.findOneAndUpdate(Video.schema.get(name), req.body.name);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port  ${PORT}`));