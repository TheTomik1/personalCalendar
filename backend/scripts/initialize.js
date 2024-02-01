// TODO: Initialize script (create admin user, images folder and .env file)
process.env["DEBUG"] = "initialize";

const fs = require('fs');
const debug = require('debug')('initialize');
const bcrypt = require('bcrypt');

const openDatabase = require('../openDatabaseConnection');

async function initialize() {
    const db = await openDatabase();

    debug('Initializing...');

    // Create images folder
    if (fs.existsSync('./api/images')) {
        debug('Images folder already exists.');
    } else {
        fs.mkdirSync('./api/images');
        debug('Images folder created.');
    }

    // Create .env file
    if (fs.existsSync('./api/.env')) {
        debug('.env file already exists.');
    } else {
        fs.writeFileSync('./api/.env', `JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}\n`);
        debug('.env file created.');
    }

    // Create admin user
    const checkIfAdminExists = await db.get(`
        SELECT * FROM users WHERE isAdmin = 1
    `);

    if (checkIfAdminExists) {
        debug('Admin account already exists.');
    } else {
        const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(randomPassword, salt);

        let query= await db.prepare(`INSERT INTO users (username, email, password, fullname, isAdmin) VALUES ('admin', null, ?, null, 1);`);
        await query.run(hash);

        debug('Admin user created.');
        debug(`In order to access the admin panel use the following: \nUsername: admin\nPassword: ${randomPassword}`);

        debug('Initialization complete.');
    }
}

initialize();
