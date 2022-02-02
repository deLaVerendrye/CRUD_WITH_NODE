const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth')


mongoose.connect(process.env.database)
        .then(console.log("Connected to database"))
        .catch( err => console.log(err))

app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

app.listen(5000, ()=> {
    console.log('listening at port 5000')
})