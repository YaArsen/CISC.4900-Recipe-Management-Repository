const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { name, email, password, repeatPassword } = req.body;
    if (password !== repeatPassword) return res.status(400).json({ message: 'Passwords do not match' });

    try {
        if (await User.findOne({ email: email })) return res.status(400).json({ message: 'Email already exists' });
        const user = new User({ name: name, email: email, password: await bcrypt.hash(password, 10), favorites: [], liked: [], commented: [] });
        await user.save();
        res.status(201).json({ message: 'User registered' });
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
            { userId: user._id, name: user.name, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.delete = async (req, res) => {
    const { userId } = req.user;

    try {
        await User.findByIdAndDelete({ _id: userId });
        res.status(200).json({ message: 'User account deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};