import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import { Strategy } from 'passport-google-oauth2';
import GoogleStrategy from 'passport-google-oauth2'
import passport from 'passport';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const generateToken =(user)=>{
  return jwt.sign(
    {id: user.id , email: user.email},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

dotenv.config();

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const emailCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0]);

    res.status(201).json({
  message: "Signup successful!",
  user: newUser.rows[0],   // includes id, name, email
});
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful!', user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
  token });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



passport.use("google", new GoogleStrategy({
    clientID: process.env.Client_ID,
    clientSecret: process.env.Client_secret,  // make sure case matches
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, cb) => {
    try {
      console.log("in google strategy");
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;

        if (!email) {
            return cb(new Error("No email found from Google"), null);
        }

        // Check if user exists
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userCheck.rows.length === 0) {
            // Hash "google" as the password
            const hashedPassword = await bcrypt.hash("google", 10);

            await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
                [name, email, hashedPassword]
            );
        }

        cb(null, { email, name, googleLogin: true });

    } catch (err) {
        cb(err, null);
    }
}));



export const googleCallback = (req, res) => {
    passport.authenticate('google', { session: false }, async(err, user) => {
        if (err ) {
            console.error('Google authentication error:', err);
            return res.redirect('/login?error=google-auth-failed');
        }

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1',[user.email]);
        const dbUser= userResult.rows[0];

        const token = generateToken(dbUser);

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/google-success?token=${token}`);
    })(req, res);
};


export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});






