const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "societyy-03041218.firebasestorage.app",
});

const bucket = admin.storage().bucket();
module.exports = { admin, bucket };
