const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true
})
const admin = require("firebase-admin")
const serviceAccount = require("./service-account.json")
const {
    WebhookClient
} = require("dialogflow-fulfillment")

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

        const session = sessionClient.sessionPath("chatbot-52280", sessionId)
        const responses = await sessionClient.detectIntent({
            session,
            queryInput
        })

        const result = responses[0].queryResult

        result.fulfillmentText

        response.send(result)
    })
})

exports.dialogflowWebhook = functions.https.onRequest(async (request, response) => {
    const agent = new WebhookClient({
        request,
        response
    })

    console.log(JSON.stringify(request.body))

    const result = request.body.queryResult

    function welcome(agent) {
        agent.add("Welcome to my agent!")
    }

    function fallback(agent) {
        agent.add("Sorry can you try again?")
    }

    async function userOnboardingHandler(agent) {
        const db = admin.firestore()
        const profile = db.collection('users').doc("jeffd23")
        const {
            name,
            color
        } = result.parameters

        await profile.set({
            name,
            color
        })

        agent.add("Welcome aboard!")
    }

    let intentMap = new Map()
    intentMap.set("Default Welcome Intent", welcome)
    intentMap.set("Default Fallback Intent", fallback)
    intentMap.set("Update Username", userOnboardingHandler)
})