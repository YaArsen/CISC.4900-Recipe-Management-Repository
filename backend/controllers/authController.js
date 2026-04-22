const User = require('../models/User');
const Recipe = require('../models/Recipe');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const transporter = require('../config/transporter');

exports.register = async (req, res) => {
    const { name, email, password, verificationToken } = req.body;

    try {
        if (await User.findOne({ email: email })) return res.status(400).json({ message: 'Email already exists' });

        if (verificationToken) {
            const user = jwt.verify(verificationToken, process.env.JWT_SECRET);

            // Create a new user and save the new user document to the database
            await new User({
                name: user.name,
                email: user.email,
                password: await bcrypt.hash(user.password, 10)
            }).save();

            res.status(201).json({ message: 'User account registered successfully' });
        } else {
            if (name && email && password) {
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
                    from: process.env.USER_EMAIL,
                    to: email,
                    subject: 'Email Verification',
                    text: 'Please verify your email',
                    html: `
                        <p>Click on the link to verify your email</p>
                        <a href='${process.env.URL_PARTS}/verify-email/${token}'>Verify Email</a>
                    `
                });

                res.status(200).json({ message: 'Please verify your email' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'User with the data not found' });

        // Generate a JSON Web Token (JWT) with user information
        const token = jwt.sign(
            {
                userId: user._id,
                name: user.name,
                email: user.email,
                favorites: user.favorites,
                liked: user.liked,
                commented: user.commented,
                timestamp: user.timestamp
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

exports.resetPassword = async (req, res) => {
    const { email, password, verificationToken } = req.body;

    try {
        if (verificationToken) {
            const user = jwt.verify(verificationToken, process.env.JWT_SECRET);
            await User.findByIdAndUpdate(user.userId, { password: await bcrypt.hash(password, 10) });
            res.status(200).json({ message: 'Password updated successfully' });
        } else {
            if (email) {
                const user = await User.findOne({ email: email });
                if (!user) return res.status(404).json({ message: 'User not found' });

                const token = jwt.sign(
                    {
                        userId: user._id
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '5m'
                    }
                );

                await transporter.sendMail({
                    from: process.env.USER_EMAIL,
                    to: email,
                    subject: 'Password reset',
                    text: 'Reset your password',
                    html: `
                        <p>Click on the link to navigate on a password reset page</p>
                        <a href='${process.env.URL_PARTS}/reset-password/${token}>Password reset page</a>
                    `
                });

                res.status(200).json({ message: 'Please verify your email '});
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateName = async (req, res) => {
    const { userId, exp } = req.user;
    const { name } = req.body;

    try {
        const user = await User.findById({ _id: userId });
        user.name = name;
        await user.save();

        const token = jwt.sign(
            {
                userId: user._id,
                name: user.name,
                email: user.email,
                timestamp: user.timestamp,
                favorites: user.favorites,
                liked: user.liked,
                commented: user.commented
            }, 
            process.env.JWT_SECRET, // Secret key from environment variables for signing the token
            {
                expiresIn: exp
            }
        );

        await Recipe.updateMany({ user: userId }, { username: name });

        for (let recipeId of user.commented.keys()) {
            const recipe = await Recipe.findById({ _id: recipeId });

            if (recipe) {
                recipe.comments.map(comment => comment.user.toString() === userId.toString() ? comment.username = name : comment);
                await recipe.save();
            } else {
                user.commented.delete(recipeId);
                await user.save();
            }
        }

        res.status(200).json({ token, message: 'Username updated successfully'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateEmail = async (req, res) => {
    const { userId, exp } = req.user;
    const { page, email, password, verificationToken } = req.body;

    try {
        if (verificationToken) {
            const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET);
            const user = await User.findById({ _id: decoded.userId });
            user.email = decoded.email;
            await user.save();

            const token = jwt.sign(
                {
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    timestamp: user.timestamp,
                    favorites: user.favorites,
                    liked: user.liked,
                    commented: user.commented
                }, 
                process.env.JWT_SECRET, // Secret key from environment variables for signing the token
                {
                    expiresIn: exp
                }
            );

            res.status(200).json({ token, message: 'User email updated successfully '});
        } else {
            if (email) {
                if (await User.findOne({ email: email })) return res.status(400).json({ message: 'Email already exists '});
                const user = await User.findById({ _id: userId });
                if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Password does not match' });

                const token = jwt.sign(
                    {
                        userId,
                        email
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '5m'
                    }
                );

                await transporter.sendMail({
                    from: process.env.USER_EMAIL,
                    to: email,
                    subject: 'Verify email',
                    text: 'Please verify your email',
                    html: `
                        <p>Click on the link to verify your email</p>
                        <a href='${process.env.URL_PARTS}/${page}/account/verify-new-email/${token}'>Verify Email</a>
                    `
                });

                res.status(200).json({ message: 'Please verify your email' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    const { userId } = req.user;
    const { password, newPassword } = req.body;

    try {
        const user = await User.findById({ _id: userId });
        if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Current password does not match' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'User password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};