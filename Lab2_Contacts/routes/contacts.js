var express = require('express');
var router = express.Router();
const contactsRepo = require('../src/contactsFileRepository');

/* GET contacts listing. */
router.get('/', function(req, res, next) {
  const data = contactsRepo.findAll();
  res.render('contacts', { title: 'Express Contacts', contacts: data } );
});

module.exports = router;
