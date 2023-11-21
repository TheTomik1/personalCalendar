const openDatabase = require('../../openDatabaseConnection');

async function getUserInformation(userId){
    const db = await openDatabase();

    const user = await db.get('SELECT username, email, createdAt, profilePicture, isBanned, isAdmin FROM users WHERE id = ?', userId);
    if (!user) {
        return null;
    }

    await db.close();
    return user;
}

module.exports = getUserInformation;