import * as functions from "firebase-functions";
import admin = require("firebase-admin");

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.scheduledFunction = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async (context) => {
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

    // Create a new game with waiting status
    await db.collection("games").doc().set({
      startTime: admin.firestore.FieldValue.serverTimestamp(),
      status: "waiting",
    });

    return null;
  });
