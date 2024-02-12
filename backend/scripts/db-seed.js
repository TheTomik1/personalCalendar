process.env["DEBUG"] = "db-seed";

const fs = require('fs');
const debug = require('debug')('db-seed');
const { open } = require('sqlite');

const openDatabase = require('../openDatabaseConnection');

async function seed() {
    try {
        const db = await openDatabase();
        debug('Seeding database...');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users
            (
                id  INTEGER PRIMARY KEY,
                username  VARCHAR(255) UNIQUE,
                email  VARCHAR(255) UNIQUE,
                password  VARCHAR(255),
                fullname  VARCHAR(255),
                createdAt  TIMESTAMP  DEFAULT (strftime('%s', 'now', 'localtime') + 3600) REFERENCES users (createdAt),
                isBanned  TINYINT(1) DEFAULT 0,
                isAdmin  TINYINT(1) DEFAULT 0
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS calendars
            (
                id  INTEGER PRIMARY KEY,
                guid TEXT,
                ownerId  INT,
                createdAt  TIMESTAMP  DEFAULT (strftime('%s', 'now', 'localtime') + 3600) REFERENCES calendars (createdAt)
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS calendarEvents 
            (
                id INTEGER NOT NULL PRIMARY KEY,
                calendarId INTEGER NOT NULL,
                eventType TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                location TEXT,
                reminderOption TEXT NOT NULL,
                reminderSent INTEGER DEFAULT 0 CHECK (reminderSent IN (0, 1)) NOT NULL,
                datetimeStart INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
                datetimeEnd INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
                color TEXT,
                FOREIGN KEY (calendarId) REFERENCES calendars(id)                                          
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS profilePictures (
                id INTEGER NOT NULL PRIMARY KEY,
                userId INTEGER NOT NULL UNIQUE,
                imageName TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `);

        await db.exec(`
            CREATE TABLE ntfyTopics
            (
                id INTEGER NOT NULL PRIMARY KEY,
                userId INTEGER NOT NULL UNIQUE,
                topic VARCHAR(255) NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `);

        await db.close();
        debug('Database seeded.');
    } catch (e) {
        debug(`Error seeding database: ${e}`);
    }
}

seed();