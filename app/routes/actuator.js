const express = require('express');

const router = express.Router();

router.get('/healthcheck', async(req, res, next) => {
    // any application health checking
    res.status(200).send('OK');
});

module.exports = router;