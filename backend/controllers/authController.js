const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (await User.findOne({ email: email })) return res.status(400).json({ message: 'Email already exists' });
        const user = new User({ name: name, email: email, password: await bcrypt.hash(password, 10), favorites: [], liked: [], commented: new Map() });
        await user.save();
        res.status(201).json({ message: 'User account registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });
        if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Email or password does not match' });

        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email, favorites: user.favorites, liked: user.liked, commented: user.commented }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    const { userId } = req.user;

    try {
        await User.findByIdAndDelete({ _id: userId });
        res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};