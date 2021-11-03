import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import useUserAuth from "../../lib/firebase/useUserAuth";
import runCodeOnPiston from "../../lib/piston/runCodeOnPiston";
import {
  DocumentData,
  getFirestore,
  query,
  collection,
  where,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  increment,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import app from "../../lib/firebase/clientApp";
import Leaderboard from "../../components/Leaderboard";
import dynamic from "next/dynamic";
import LanguageDropdown from "../../components/LanguageDropdown";
import Player from "../../types/Player";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import Auth from "../../components/Auth";
const CodeEditor = dynamic(import("../../components/CodeEditor"), {
  ssr: false,
});

interface Props {}

export default function GameId({}: Props): ReactElement {
  const db = getFirestore(app);
  const { loading, user } = useUserAuth();
  const router = useRouter();
  const { id } = router.query;
  const [output, setOutput] = useState<any>();
  const [outputContent, setOutputContent] =
    useState<{ success: any; message: any; expected: any; provided: any }>();
  const [questions, setQuestions] = useState<any>();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Manage top-level form-state of sub-components
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [players, setPlayers] = useState<Player[]>([]);

  // Manage successful submission state to show snackbar component
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const [victory, setVictory] = useState<boolean>(false);

  useEffect(() => {
    (async function getQuestions() {
      if (id) {
        // Get the question IDs from Firestore document
        const docRef = doc(db, "games", id as string);
        const docSnap = await getDoc(docRef);
        const { questionOneId, questionTwoId, questionThreeId } =
          docSnap.data() as DocumentData;

        console.log(questionOneId, questionTwoId, questionThreeId);

        // Now get those questions from the question collection
        const q = query(
          collection(db, "questions"),
          where("id", "in", [questionOneId, questionTwoId, questionThreeId])
        );

        const qSnap = await getDocs(q);

        const thisGamesQuestions = qSnap.docs.map((doc) => doc.data());

        setQuestions(thisGamesQuestions);

        // Get all the player documents from this game from the players subcollection
        const playersRef = collection(db, `games/${id}/players`);
        const playersSnap = await getDocs(playersRef);
        const thisGamesPlayers = playersSnap.docs.map(
          (doc) => doc.data() as Player
        );

        // Then listen for live updates to the players collection
        const unsubscribe = onSnapshot(playersRef, (snap) => {
          // When a doc changes, update that document in the players array in state
          const updatedPlayers = snap.docs.map((doc) => doc.data() as Player);
          setPlayers(updatedPlayers);
        });

        setPlayers(thisGamesPlayers);
      }
    })();
  }, [db, id]);

  async function handleSubmit() {
    const result = await runCodeOnPiston(
      language,
      code,
      Object.values(questions[activeQuestionIndex].args),
      Object.values(questions[activeQuestionIndex].acceptedAnswers)
    );
    setOutput(result?.success);
    setOutputContent({
      success: result?.success,
      message: result?.message,
      expected: result?.expected,
      provided: result?.provided,
    });

    if (user) {
      const playerRef = doc(db, `games/${id}/players/${user.uid}`);
      if (result?.success === true) {
        // If answer is correct then update player score by 1
        setShowSnackbar(true);
        await updateDoc(playerRef, {
          score: increment(1),
        });

        if (activeQuestionIndex != 2) {
          setActiveQuestionIndex(activeQuestionIndex + 1);
        } else {
          // Display victory screen!
          setVictory(true);
        }

        // Also send this player to the next question
        setActiveQuestionIndex(activeQuestionIndex + 1);
      } else {
        // If answer is incorrect then set player status to dead
        await updateDoc(playerRef, {
          status: "dead",
        });
      }
    }
  }

  // change the current code to the default code for the new language whenever the language changes
  useEffect(() => {
    setCode(
      questions?.[activeQuestionIndex]?.[`default${language}text`]?.replace(
        /\\n/g,
        "\n"
      )
    );
  }, [language, questions, activeQuestionIndex]);

  // Get the current player from the players array in state using the user's UID
  const currentPlayer = players.find((player) => player.id === user?.uid);

  // If the user is not in the game, then add them to it
  if (!currentPlayer && user) {
    const playerRef = doc(db, `games/${id}/players/${user.uid}`);
    setDoc(playerRef, {
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      status: "alive",
      score: 0,
    });
  }

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "grid",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (victory) {
    return (
      <Container maxWidth="xl" style={{ height: "95vh", marginTop: "64px" }}>
        <Grid
          style={{ height: "100%" }}
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={5}
        >
          <Grid item xs={12}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <Grid item>
                <Typography variant="h2">
                  <b>Congratulations</b>, you won the Coding Squid Game!
                </Typography>
              </Grid>
              <Grid item>
                <Leaderboard
                  players={players}
                  style={{
                    width: "auto",
                    overflowY: "auto",
                    maxHeight: 421.5,
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push(`/`)}
                >
                  Play Again
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" style={{ height: "95vh", marginTop: "64px" }}>
      {/* If the user is signed in AND is actually in this game */}
      {currentPlayer && user ? (
        <Grid
          style={{ height: "100%" }}
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={5}
        >
          {currentPlayer.status === "alive" && (
            <>
              <Grid item xs={12} sm={4}>
                <Grid container direction="column" spacing={9}>
                  {/* Question */}
                  <Grid item>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography variant="h3">
                          {questions?.[activeQuestionIndex].name}
                        </Typography>
                      </Grid>

                      <Grid item>
                        <Typography variant="body1">
                          {questions?.[activeQuestionIndex].content}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Leaderboard */}
                  <Grid item>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography variant="h5">Leaderboard</Typography>
                      </Grid>

                      <Grid item>
                        <Leaderboard players={players} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={7} style={{ padding: 0 }}>
                {questions?.[activeQuestionIndex]?.[
                  `default${language}text`
                ] && (
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Grid
                        container
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          {/* Dropdown lang editor */}
                          <LanguageDropdown
                            language={language}
                            setLanguage={setLanguage}
                          />
                        </Grid>
                        <Grid item>
                          {/* Dropdown lang editor */}
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleSubmit()}
                          >
                            Submit
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <CodeEditor
                        language={language}
                        setCode={setCode}
                        defaultText={code}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          {currentPlayer.status === "dead" && (
            <Grid item xs={12} sm={12}>
              <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
              >
                <Grid item>
                  <Typography variant="h2">You Died</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    Expected Outputs:{" "}
                    <b style={{ color: "green" }}>{outputContent?.expected}</b>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    Your Output:{" "}
                    <b style={{ color: "red" }}>{outputContent?.provided}</b>
                  </Typography>
                </Grid>

                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push(`/`)}
                  >
                    Play Again
                  </Button>
                </Grid>
                <Grid item>
                  <Leaderboard
                    players={players}
                    style={{
                      width: "auto",
                      overflowY: "auto",
                      maxHeight: 421.5,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      ) : (
        <Auth />
      )}
      {showSnackbar && (
        <SuccessSnackbar open={showSnackbar} setOpen={setShowSnackbar} />
      )}
    </Container>
  );
}
