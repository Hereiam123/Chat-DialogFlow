const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
})
const admin = require("firebase-admin")
const serviceAccount = require("./service-account.json")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chatbot-52280.firebaseio.com"
});

const {
    SessionsClient
} = require("dialogflow")

exports.dialogflowGateway = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {

        //Query input is the information passed from the user
        //Audio or text data
        const {
            queryInput,
            sessionId
        } = request.body

        const sessionClient = new SessionsClient({
            credentials: serviceAccount
        })

        const session = sessionClient.sessionPath("Chatbot", sessionId)
    })
})