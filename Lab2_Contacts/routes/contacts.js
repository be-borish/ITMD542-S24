var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const contactsRepo = require('../src/contactsFileRepository');

/* GET contacts listing */
router.get('/', function(req, res, next) {
  const data = contactsRepo.findAll();
  res.render('contacts', { title: 'Express Contacts', contacts: data } );
});

/* GET contacts add */
router.get('/add', function(req, res, next) {
  res.render('contacts_add', { title: 'Add a New Contact'} );
});

/* POST contacts add */
router.post('/add', 
body('firstName').trim().notEmpty().withMessage('First name cannot be empty!'),
body('lastName').trim().notEmpty().withMessage('Last name cannot be empty!'),
body('email').optional({values: 'falsy'}).trim().isEmail().withMessage('Email must be a valid email address!'),
function(req, res, next) {
  const result = validationResult(req);
  console.log(req.body);
  if (!result.isEmpty()) {
    res.render('contacts_add', {
      title: 'Add a Contact',
      msg: result.array(),
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      notes: req.body.notes.trim()
    });
  } else {
    contactsRepo.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      email: req.body.email.trim(),
      notes: req.body.notes.trim()
    });
    res.redirect('/contacts');
  }
});

/* GET a contact */
router.get('/:uuid', function(req, res, next) {
  const contact = contactsRepo.findById(req.params.uuid);
  console.log(contact);
  if (contact) {
    res.render('contact', {
      title: `${contact.firstName} ${contact.lastName}'s Contact Information`,
      contact: contact
    });
  } else {
    res.redirect('/contacts');
  }
  
});

/* GET contacts edit */
router.get('/:uuid/edit', function(req, res, next) {
  const contact = contactsRepo.findById(req.params.uuid);
  res.render('contacts_edit', {
    title: `Edit ${contact.firstName} ${contact.lastName}'s Contact Information`,
    contact: contact
  });
});

/* POST contacts edit */
router.post('/:uuid/edit', function(req, res, next) {
  const contact = contactsRepo.findById(req.params.uuid);
  if (req.body.firstName.trim() === '' || req.body.lastName.trim() === '') {
    res.render('contacts_edit', {
      title: `Edit ${contact.firstName} ${contact.lastName}'s Contact Information`,
      msg: 'First & Last name cannot be empty!',
      contact: contact
    });
  } else {
    const updatedContact = {
      id: req.params.uuid,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      notes: req.body.notes,
      dateCreated: contact.dateCreated
    };
    contactsRepo.update(updatedContact);
    res.redirect('/contacts');
  }
});

/* GET contacts delete */
router.get('/:uuid/delete', function(req, res, next) {
  const contact = contactsRepo.findById(req.params.uuid);
  res.render('contacts_delete', { title: 'Delete Contact', contact: contact} );
});

module.exports = router;
