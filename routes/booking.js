const express = require('express');
const router = express.Router();
const bookingModel = require('../models/booking');
const trainModel = require('../models/train');
const { authenticateToken } = require('../middleware/authMiddleware');
const pool = require('../config/db'); 


router.post('/:trainId', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const trainId = req.params.trainId;

    let connection; 

    try {
        connection = await pool.getConnection(); 
        

        
        await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');

        await connection.beginTransaction(); 
        
        
        const [trainRows] = await connection.execute('SELECT * FROM trains WHERE id = ? FOR UPDATE', [trainId]);
        const train = trainRows[0];

        if (!train) {
            await connection.rollback();
            return res.status(404).json({ message: 'Train not found' });
        }

        if (train.available_seats <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'No seats available' });
        }

        
        const [updateResult] = await connection.execute(
            'UPDATE trains SET available_seats = available_seats - 1 WHERE id = ? AND available_seats > 0',
            [trainId]
        );

        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(409).json({ message: 'Seat booking failed.  Likely a concurrency issue - seat already booked.' }); // Conflict
        }

        
        const bookingId = await bookingModel.createBooking(userId, trainId);

        
        await connection.commit();

        res.status(201).json({ message: 'Booking successful', bookingId });

    } catch (error) {
        console.error('Booking error:', error);
        if (connection) {
            try{
                await connection.rollback(); 
            }
            catch(rollbackError){
                console.log("rollback error",rollbackError);
            }
            
        }
        res.status(500).json({ message: 'Booking failed', error: error.message });
    } finally {
        if (connection) {
            try{
                await connection.release();
            }
            catch(releaseError){
                console.log('connection release error',releaseError);
            }
        }
    }
});




router.get('/:bookingId', authenticateToken, async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const userId = req.user.id;

        const booking = await bookingModel.getBookingById(bookingId, userId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch booking details', error: error.message });
    }
});

module.exports = router;

