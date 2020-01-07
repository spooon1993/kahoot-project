const { Router } = require('express');
const prepareBody = require('../controllers/prepareBody');
const controller = require('../controllers/rooms');
const createToken = require('../controllers/createToken');

const router = Router();

router.get('/', controller.readAll, prepareBody, (req, res) => {
  res.json(req.responseData);
});

router.get('/:id/', controller.readOne, prepareBody, (req, res) => {
  res.json(req.responseData);
});

router.post('/', controller.create, prepareBody, (req, res) => {
  res.json(req.responseData);
});

router.post('/check/', controller.check, createToken, prepareBody, (req, res) => {
  res.json(req.responseData);
});

router.put('/:id/', controller.update, prepareBody, (req, res) => {
  res.json(req.responseData);
});

router.delete('/:id/', controller.delete, prepareBody, (req, res) => {
  res.json(req.responseData);
});


module.exports = router;
