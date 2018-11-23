const express = require('express');
const router = express.Router();
const Joi = require('joi');
const reiProducts = require('../lib/reiProducts');

router.post('/rei-search', function(req, res, next) {
  const schema = {
      search: Joi.string().required(),
      page: Joi.number(),
      limit: Joi.number()
  };
  const result = Joi.validate(req.body, schema);
  if(result.error) {
    //returning just the first error message
    res.status(400).send(result.error.details[0].message);
    return;
  }

  var rei = new reiProducts();
  let page = req.body.page || 1;
  let limit = req.body.limit || 30;

  rei.fetch(req.body.search, page, limit).then(function(result) {
      res.send({'success' : 1, 'data': result});
  }, function(err) {
      console.log(err);
      next(err);
  });
  
});

module.exports = router;
