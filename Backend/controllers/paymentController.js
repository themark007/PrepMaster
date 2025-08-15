import pool from '../config/db.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
export const dummyPayment = async (req, res) => {
    try {
        userId = 1;
        planId = 1;
        
    
        if (!userId || !planId) {
        return res.status(400).json({ success: false, message: "userId and planId are required" });
        }
    
        // Simulate payment processing
        const paymentResponse = await fetch('https://dummy-payment-gateway.com/api/pay', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, planId })
        });
    
        const paymentData = await paymentResponse.json();
    
        if (!paymentData.success) {
        return res.status(500).json({ success: false, message: "Payment failed" });
        }
    
        // Update user's active plan in the database
        await pool.query(
        'UPDATE users SET active_plan = $1 WHERE id = $2',
        [planId, userId]
        );
    
        res.json({ success: true, message: "Payment successful", data: paymentData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
    }
        
