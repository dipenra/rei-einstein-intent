const express = require('express');
const router = express.Router();
const Joi = require('joi');
const reiProducts = require('../lib/reiProducts');
const einsteinIntent = require('../lib/einsteinIntent');


function sendError(res, status, error) {
  res.status(status).send({'success': 0, 'error': error.toString()});
}

/**
 * REI Search
 * Routes for REI search API 
 */
router.post('/rei-search', function(req, res, next) {
  const schema = {
      search: Joi.string().required(),
      page: Joi.number(),
      limit: Joi.number()
  };
  const result = Joi.validate(req.body, schema);
  if(result.error) {
    sendError(res, 400, result.error.details[0].message);
    return;
  }

  var rei = new reiProducts();
  let page = req.body.page || 1;
  let limit = req.body.limit || 30;

  rei.fetch(req.body.search, page, limit).then(function(result) {
      res.send({'success' : 1, 'data': result});
  }, function(err) {
      sendError(res, 500, err);
  });
  
});

/**
 * Einstein Intent
 * Routes for Einstein Intent API 
 */
router.post('/einstein-intent', function(req, res, next) {
  const schema = {
      search: Joi.string().required()
  };
  const result = Joi.validate(req.body, schema);
  if(result.error) {
    //returning just the first error message
    sendError(res, 400, result.error.details[0].message);
    return;
  }

  var einstein = new einsteinIntent();
  einstein.getUserIntent(req.body.search).then(function(result) {
    res.send({'success' : 1, 'data': {'search': req.body.search, 'einstein_response' : result, 'intent': einstein.getIntent(result)}});
  }, function(err) {
    sendError(res, 500, err);
  });
  
});

module.exports = router;
