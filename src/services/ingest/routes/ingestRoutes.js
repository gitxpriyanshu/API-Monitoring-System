import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    res.json({ message: 'Ingest routes working' });
});

export default router;
