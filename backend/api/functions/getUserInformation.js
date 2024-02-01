const openDatabase = require('../../openDatabaseConnection');

async function getUserInformation(userId) {
    const db = await openDatabase();

    const userInfo = await db.get(`
        SELECT users.id, username, email, password, fullname, createdAt, accessToken, isAdmin, topic, profilePicture FROM users 
        LEFT JOIN ntfyTopics nT on users.id = nT.userId 
        LEFT JOIN profilePictures pP on users.id = pP.userId WHERE users.id = ?
    `, userId);

    if (!userInfo) {
        return null;
    }

    await db.close();
    return userInfo;
}

module.exports = getUserInformation;