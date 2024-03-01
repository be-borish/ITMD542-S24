const path = require('node:path');
const betterSqlite3 = require('better-sqlite3');

const db = new betterSqlite3(path.join(__dirname, '../data/contacts.sqlite'), { verbose: console.log });

const createStmt = db.prepare("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, email TEXT, notes TEXT, dateCreated TIMESTAMP, dateUpdated TIMESTAMP)");
createStmt.run();

const repo = {

    findAll: () => {
        const stmt = db.prepare("SELECT * FROM contacts");
        const rows = stmt.all();
        let contacts = [];

        rows.forEach((row) => {
            contacts.push({
                id: row.id,
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                notes: row.notes,
                dateCreated: row.dateCreated,
                dateUpdated: row.dateUpdated
            });
        });

        return contacts;
    },

    findById: (uuid) => {
        
        const stmt = db.prepare("SELECT * FROM contacts WHERE id = ?");
        const row = stmt.get(uuid);

        return {
            id: row.id,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            notes: row.notes,
            dateCreated: row.dateCreated,
            dateUpdated: row.dateUpdated
        };
    },

    create: (contact) => {
        const stmt = db.prepare("INSERT INTO contacts (firstName, lastName, email, notes, dateCreated, dateUpdated) VALUES (?, ?, ?, ?, DATETIME('now', 'localtime'), DATETIME('now', 'localtime'))");
        const info = stmt.run(contact.firstName, contact.lastName, contact.email, contact.notes);
        console.log(`Contact created with id: ${info.lastInsertRowid}`);
    },
    
    deleteById: (uuid) => {
        const stmt = db.prepare("DELETE FROM contacts WHERE id = ?");
        const info = stmt.run(uuid);
        console.log(`Rows affected: ${info.changes}`);
    },

    update: (contact) => {
        const stmt = db.prepare("UPDATE contacts SET firstName = ?, lastName = ?, email = ?, notes = ?, dateUpdated = DATETIME('now', 'localtime') WHERE id = ?");
        const info = stmt.run(contact.firstName, contact.lastName, contact.email, contact.notes, contact.id);
        console.log(`Rows affected: ${info.changes}`);
    },
};

module.exports = repo;