const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require('../config/transporter');

exports.register = async (req, res) => {
    const { name, email, password, verificationToken } = req.body;

    try {
        // Check if a user with the provided email already exists in the database
        if (await User.findOne({ email: email })) return res.status(400).json({ message: 'Email already exists' });

        if (verificationToken) {
            const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);

            // Create a new user instance with the provided data
            const user = new User({
                name: decoded.name,
                email: decoded.email,
                password: await bcrypt.hash(decoded.password, 10)
            });

            await user.save(); // Save the new user document to the database
            res.status(201).json({ message: 'User account registered successfully' }); // Send a success response upon successful registration
        } else {
            const token = jwt.sign(
                {
                    name, 
                    email, 
                    password
                },
                process.env.JWT_SECRET, // Secret key from environment variables for signing the token
                {
                    expiresIn: '5m' // Token expiration time (5 minutes)
                }
            );

            await transporter.sendMail({
                from: 'ars7ya@gmail.com',
                to: email,
                subject: 'Email Verification',
                text: 'Please verify your email',
                html: `
                    <p>Click on the link to verify your email</p>
                    <a href='http://localhost:3000/verify-email/${token}'>Verify Email</a>
                `
            });

            res.status(200).json({ message: 'Please verify your email' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any server errors during the process
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email }); // Find the user by email
        // Check if the user exists and if the provided password matches the hashed password in the database
        if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'User with the data not found' });

        // Generate a JSON Web Token (JWT) with user information
        const token = jwt.sign(
            {
                userId: user._id,
                name: user.name,
                email: user.email,
                favorites: user.favorites,
                liked: user.liked,
                commented: user.commented
            }, 
            process.env.JWT_SECRET, // Secret key from environment variables for signing the token
            {
                expiresIn: '1h' // Token expiration time (1 hour)
            }
        );

        res.status(200).json({ token }); // Send a success response with the generated token
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any server errors during the process
    }
};

exports.deleteAccount = async (req, res) => {
    const { userId } = req.user; // Extract userId from the authenticated user object attached to the request by an auth middleware

    try {
        await User.findByIdAndDelete({ _id: userId }); // Find and delete the user document matching the userId
        res.status(200).json({ message: 'User account deleted successfully' }); // Send a success response upon successful account deletion
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any server errors during the process
    }
};