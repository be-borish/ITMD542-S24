const fs = require('node:fs');
const path = require('node:path');
const db = new Map();

const loadData = () => {
    const jsonData = fs.readFileSync(path.join(__dirname, '../data/contacts.json'));
    const contactsArray = JSON.parse(jsonData);
    contactsArray.forEach((element) => {
        //db.set(element[0], element[1]);
    });
};

const saveData = () => {
    const stringifyData = JSON.stringify(Array.from(db));
    fs.writeFileSync(path.join(__dirname, '../data/contacts.json'), stringifyData);
};

const repo = {
    findAll: () => Array.from(db.values())
};


loadData();

module.exports = repo;