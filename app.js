const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { check, validationResult } = require('express-validator');

const dotenv = require('dotenv');
dotenv.config({path : 'config.env'});

const app = express();

app.use(morgan("tiny"));

app.use(express.urlencoded({extended : true}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res, next) => {
    res.render('index.ejs');
})

let formValidation = [
    check('name').notEmpty().withMessage('Name is required')
        .isAlpha('en-US', {ignore: ' '}).withMessage('Name must contain only alphabetic characters'),
    check('email').isEmail({host_whitelist : ['gmail.com']}).withMessage('Email must end with @gmail.com'),
    check('password')
        .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase character')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase character'),
        check('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
            return false;
            }
            return true;
        }).withMessage('Password confirmation does not match password'),
    check('birthdate').isDate().withMessage('Invalid birthdate')
];

app.post('/', formValidation, (req, res, next) => {
    
    const err = validationResult(req);
    if(err.array().length) {
        const messages = errors.array().map(err => ({
            field: err.param,
            message: err.msg,
        }));
        return res.status(400).json({ errors: messages});
    } 
    res.send('successful');
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
    console.log(err);
    console.log(`listening on port ${PORT}`);
})