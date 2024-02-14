process.env["DEBUG"] = "db-seed";

const fs = require('fs');
const debug = require('debug')('db-seed');

const openDatabase = require('./openDatabaseConnection');

async function seed() {
    try {
        const db = await openDatabase();
        debug('Creating tables and seeding...');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users
            (
                id  INTEGER PRIMARY KEY,
                username  VARCHAR(255) UNIQUE,
                fullname  VARCHAR(255),
                email  VARCHAR(255) UNIQUE,
                password  VARCHAR(255),
                createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                isBanned  TINYINT(1) DEFAULT 0 CHECK (isBanned IN (0, 1)) NOT NULL,
                isAdmin  TINYINT(1) DEFAULT 0 CHECK (isAdmin IN (0, 1)) NOT NULL
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS calendars
            (
                id  INTEGER PRIMARY KEY,
                userId  INT NOT NULL,
                createdAt  TIMESTAMP  DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS calendarEvents 
            (
                id  INTEGER NOT NULL PRIMARY KEY,
                calendarId  INTEGER NOT NULL,
                eventType  TEXT NOT NULL,
                title  TEXT NOT NULL,
                description  TEXT,
                location  TEXT,
                reminderOption  TEXT NOT NULL,
                reminderSent  INTEGER DEFAULT 0 CHECK (reminderSent IN (0, 1)) NOT NULL,
                datetimeStart  INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
                datetimeEnd  INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
                color  TEXT,
                FOREIGN KEY (calendarId) REFERENCES calendars(id)                                          
            );
        `);

        await db.exec(`
            CREATE TABLE IF NOT EXISTS profilePictures (
                id  INTEGER PRIMARY KEY,
                userId  INTEGER UNIQUE NOT NULL,
                imageName  TEXT NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `);

        await db.exec(`
            CREATE TABLE ntfyTopics
            (
                id  INTEGER PRIMARY KEY,
                userId  INTEGER UNIQUE NOT NULL,
                topic  VARCHAR(255) NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `);

        await db.close();
        debug('Successfully seeded database.');
    } catch (e) {
        if (e.message.includes('already exists')) {
            debug('\x1b[31m', 'Tables already exist. Delete the database file and try again.');
            return;
        }

        debug(`Error seeding database: ${e}`);
    }
}

seed();