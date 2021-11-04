import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Auth from "../components/Auth";
import useUserAuth from "../lib/firebase/useUserAuth";
import {
  DocumentData,
  onSnapshot,
  getFirestore,
  query,
  collection,
  where,
  setDoc,
  doc,
  getDocs,
  DocumentSnapshot,
} from "firebase/firestore";
import app from "../lib/firebase/clientApp";
import formatMillisecondsToTimer from "../lib/format/formatMillisecondsToTimer";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const db = getFirestore(app);
  const router = useRouter();

  // Grab user from Firebase Authentication using custom hook
  const { loading, user } = useUserAuth();
  // Store a reference to the next upcoming game document from Firestore
  const [nextGameRef, setNextGameRef] =
    useState<DocumentSnapshot<DocumentData>>();
  // Stateful value to calculate the remaining time until the next game begins.
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    (async function getNextGame() {
      // Make the query for the waiting document
      const q = query(
        collection(db, "games"),
        where("status", "==", "waiting")
      );
      const querySnapshot = await getDocs(q);
      const waitingGameDocRef = querySnapshot.docs[0].ref;

      // Then listen for live updates on that specific doc
      onSnapshot(waitingGameDocRef, (doc) => {
        setNextGameRef(doc);
      });
    })();
  }, [db]);

  useEffect(() => {
    if (nextGameRef) {
      const nextStartTime =
        nextGameRef.data()?.startTime.seconds * 1000 + 60 * 1000; // add a minute til game actually starts
      const timeTilStart = nextStartTime - Date.now(); // milliseconds
      setRemainingTime(timeTilStart);
    }
  }, [nextGameRef]);

  // Timer to countdown until game begins
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((remainingTime) => remainingTime - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Once the user is available, join them into the "waiting game"
  useEffect(() => {
    (async function addPlayer() {
      if (user && nextGameRef) {
        const db = getFirestore(app);
        await setDoc(doc(db, `games/${nextGameRef.id}/players/${user.uid}`), {
          id: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          status: "alive",
          score: 0,
        });
      }
    })();
  }, [user, nextGameRef]);

  // In the client, listen for the update when the game goes to "inProgress"
  // when it does, navigate user on the client to /game/[id]
  if (nextGameRef?.data()?.status === "inProgress" && user) {
    router.push(`/game/${nextGameRef.id}`);
  }

  return (
    <Grid
      style={{
        width: "100vw",
        height: "100vh",
      }}
      container
      alignItems="center"
      justifyContent="center"
    >
      {loading ? (
        <div>Loading</div>
      ) : (
        <div>
          {user && (
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <Grid item>
                <Typography variant="h3">
                  Hello, {user.displayName !== "" ? user.displayName + "." : ""}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  The next game will begin in:
                </Typography>
              </Grid>
              <Grid item>
                {/* Firebase Game document will store what time the game should start. (1 minute after the doc is created) */}
                {/* Grab that value and minus the current time, convert that time to minutes and seconds and display it here */}
                {/* Update it every 1 second until it hits 0, at which point the game id the user is a part of should kick off */}
                <Typography variant="h2">
                  {formatMillisecondsToTimer(remainingTime)}
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="subtitle2">
                  You will be automatically connected.
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="subtitle2">
                  <Link href="https://www.youtube.com/c/JarrodWatts/videos">
                    <a target="_blank">Made by Jarrod Watts</a>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          )}
          {!user && <Auth />}
        </div>
      )}
    </Grid>
  );
}
