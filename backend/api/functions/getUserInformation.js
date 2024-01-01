const openDatabase = require('../../openDatabaseConnection');

async function getUserInformation(userId){
    const db = await openDatabase();

    const user = await db.get('SELECT id, username, email, password, fullname, createdat, profilepicture, isAdmin FROM users WHERE id = ?', userId);
    if (!user) {
        return null;
    }

    await db.close();
    return user;
}

module.exports = getUserInformation;