process.env["DEBUG"] = "initialize";

const fs = require('fs');
const debug = require('debug')('initialize');
const bcrypt = require('bcrypt');

const openDatabase = require('./openDatabaseConnection');

async function initialize() {
    const db = await openDatabase();

    debug('Initializing...');

    // Create images folder
    if (fs.existsSync('./api/images')) {
        debug('Images folder already exists. Preparing to delete all its files...');
        fs.readdirSync('./api/images').forEach(file => {
            fs.unlinkSync(`./api/images/${file}`);
        });
        debug('All files deleted.');
    } else {
        fs.mkdirSync('./api/images');
        debug('Images folder created.');
    }

    // Create .env file
    if (fs.existsSync('./api/.env')) {
        debug('.env file already exists.');
    } else {
        fs.writeFileSync('./api/.env', `JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}\nNTFY_BASE_URL=https://ntfy.sh\n`);
        debug('.env file created.');
    }

    // Create admin user and check if table and admin user already exist.
    const checkIfTableExists = await db.get(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='users'
    `);

    if (!checkIfTableExists) {
        debug("\x1b[31m", 'Table users does not exist! Please run db-seed.js first.');
        return;
    }

    const checkIfAdminExists = await db.get(`
        SELECT * FROM users WHERE isAdmin = 1
    `);

    if (checkIfAdminExists) {
        debug('Admin user already exists.');
    } else {
        const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(randomPassword, salt);

        let query= await db.prepare(`INSERT INTO users (username, email, password, fullname, isAdmin) VALUES ('admin', null, ?, null, 1);`);
        await query.run(hash);

        debug('Admin user created.');
        debug(`In order to access the admin panel use the following credentials: \nUsername: admin\nPassword: ${randomPassword}`);
        debug("The login page is located at /admin-login");

        debug('Initialization complete.');
    }
}

initialize();
