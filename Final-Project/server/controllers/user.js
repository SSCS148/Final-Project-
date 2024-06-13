const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.checkEmail = async (req, res) => {
    const { email } = req.query;
    console.log("Check email request received:", email);

    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error("Error checking email:", error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.register = async (req, res) => {
    const { name, email, password, age } = req.body;
    console.log("Register request received:", req.body);

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            age
        });

        await newUser.save();

        // Générer le token JWT
        const token = jwt.sign({ id: newUser.id }, 'secretKey', { expiresIn: '24h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login request received:", req.body);

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("Invalid credentials");
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, 'secretKey', { expiresIn: '24h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.refreshToken = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(403).send('Token is required');
    }
  
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      }
  
      const newToken = jwt.sign({ id: decoded.id }, 'secretKey', { expiresIn: '24h' });
      res.json({ token: newToken });
    });
  };
  