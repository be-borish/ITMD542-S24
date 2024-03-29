var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const contactsRepo = require('../src/contactsSQLiteRepository');

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
  contact.dateCreated = new Date(contact.dateCreated).toLocaleString();
  contact.dateUpdated = new Date(contact.dateUpdated).toLocaleString();
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
router.post('/:uuid/edit',
body('firstName').trim().notEmpty().withMessage('First name cannot be empty!'),
body('lastName').trim().notEmpty().withMessage('Last name cannot be empty!'),
body('email').optional({values: 'falsy'}).trim().isEmail().withMessage('Email must be a valid email address!'),
function(req, res, next) {
  const result = validationResult(req);
  const contact = contactsRepo.findById(req.params.uuid);
  contact.notes = req.body.notes.trim();
  //console.log(req.body);
  if (!result.isEmpty()) {
    res.render('contacts_edit', {
      title: `Edit ${contact.firstName} ${contact.lastName}'s Contact Information`,
      msg: result.array(),
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

/* POST contacts delete */
router.post('/:uuid/delete', function(req, res, next) {
  contactsRepo.deleteById(req.params.uuid);
  res.redirect('/contacts');
});

module.exports = router;
