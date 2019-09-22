const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
})
const admin = require("firebase-admin")
const serviceAccount = require("./service-account.json")