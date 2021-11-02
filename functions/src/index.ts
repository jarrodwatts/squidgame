import * as functions from "firebase-functions";
import admin = require("firebase-admin");

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.scheduledFunction = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
    let questionOneId: string = "";
    let questionTwoId: string = "";
    let questionThreeId: string = "";

    // Grab db using Firebase admin library
    const app = admin.apps[0] || admin.initializeApp();
    const db = app.firestore();

    const gamesRef = db.collection("games");
    // Create and execute a query for the current "waiting" game document
    const waitingGameQuery = await gamesRef
      .where("status", "==", "waiting")
      .get();
    const waitingGameDoc = waitingGameQuery.docs[0].ref;
    waitingGameDoc.update({ status: "inProgress" });

    // A function that generates a new random number between 1 and 10
    const randomNumber = () => (Math.floor(Math.random() * 10) + 1).toString();

    // Generate three random numbers that are not the same
    while (
      questionOneId === questionTwoId || // Q1 = Q2
      questionOneId === questionThreeId || // Q1 = Q3
      questionTwoId === questionThreeId // Q2 = Q3
    ) {
      questionOneId = randomNumber();
      questionTwoId = randomNumber();
      questionThreeId = randomNumber();
    }

    // Create a new game with waiting status
    await db.collection("games").doc().set({
      startTime: admin.firestore.FieldValue.serverTimestamp(),
      status: "waiting",
      questionOneId,
      questionTwoId,
      questionThreeId,
    });

    return null;
  });
