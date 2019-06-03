//exress framework
const express = require('express');
//view
const expressLayouts = require('express-ejs-layouts');
//mongodb
const mongoose = require('mongoose'); 
//express server
const app = express();

//DB Config
const db = 'mongodb+srv://Nadi:nadi@nodejs-e52r4.mongodb.net/test?retryWrites=true&w=majority'

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser
app.use(express.urlencoded({extended: false}));

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

//port to run the app on 
const PORT = process.env.PORT || 5000;

//run server and pass a port 
app.listen(PORT, console.log(`Server started on port ${PORT}`));