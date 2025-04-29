const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const connectDB = require('./src/config/database');
const passportConfig = require('./src/config/passport-config');
const app = express();

// Connect to the database
connectDB();

// Passport configuration
passportConfig(passport);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Routes
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');
const userRoutes = require('./src/routes/userRoutes');
app.use('/subscriptions', subscriptionRoutes);
app.use('/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});