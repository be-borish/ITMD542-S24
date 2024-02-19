const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const db = new Map();

const loadData = () => {
    const jsonData = fs.readFileSync(path.join(__dirname, '../data/contacts.json'));
    const contactsArray = JSON.parse(jsonData);
    contactsArray.forEach((element) => {
        db.set(element[0], element[1]);
    });
};

const saveData = () => {
    const stringifyData = JSON.stringify(Array.from(db));
    fs.writeFileSync(path.join(__dirname, '../data/contacts.json'), stringifyData);
};

const repo = {
    findAll: () => Array.from(db.values()),
    findById: (uuid) => db.get(uuid),
    create: (contact) => {
        const createTimestamp = new Date();
        const newContact = {
            id: crypto.randomUUID(),
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            notes: contact.notes,
            dateCreated: createTimestamp,
            dateUpdated: createTimestamp
        };
        db.set(newContact.id, newContact);
        saveData();
    },
    deleteById: (uuid) => {
        db.delete(uuid);
        saveData();
    },
    update: (contact) => {
        db.set(contact.id, {
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            notes: contact.notes,
            dateCreated: contact.dateCreated,
            dateUpdated: new Date()
        });
        saveData();
    },
};

loadData();

module.exports = repo;