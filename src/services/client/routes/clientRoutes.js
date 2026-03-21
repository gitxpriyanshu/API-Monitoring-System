import express from 'express';

const router = express.Router();

router.get('/client', (req, res) => {
    res.json({ message: 'Client routes working' });
});

export default router;
