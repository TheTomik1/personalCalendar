const openDatabase = require('../../openDatabaseConnection');

async function getUserInformation(userId){
    const db = await openDatabase();

    const userInfo = await db.get('SELECT * FROM users WHERE id = ?', userId);
    if (!userInfo) {
        return null;
    }

    await db.close();
    return userInfo;
}

module.exports = getUserInformation;