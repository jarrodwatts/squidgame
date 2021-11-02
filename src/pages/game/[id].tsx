import { Button, Container, Grid, Typography } from "@mui/material";
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
} from "firebase/firestore";
import app from "../../lib/firebase/clientApp";
import Leaderboard from "../../components/Leaderboard";
import dynamic from "next/dynamic";
import LanguageDropdown from "../../components/LanguageDropdown";
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
  const [questions, setQuestions] = useState<any>();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<0 | 1 | 2>(0);

  // Manage top-level form-state of sub-components
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

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
      }
    })();
  }, [id]);

  async function handleSubmit() {
    const result = await runCodeOnPiston(
      language,
      code,
      Object.values(questions[activeQuestionIndex].args),
      Object.values(questions[activeQuestionIndex].acceptedAnswers)
    );
    setOutput(result);
  }

  return (
    <Container maxWidth="xl" style={{ height: "95vh", marginTop: "64px" }}>
      <Grid
        style={{ height: "100%" }}
        container
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={5}
      >
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
                  <Leaderboard />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={7} style={{ padding: 0 }}>
          {questions?.[activeQuestionIndex]?.[`default${language}text`] && (
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
                  defaultText={
                    // transform \n to new lines
                    questions?.[activeQuestionIndex]?.[
                      `default${language}text`
                    ].replace(/\\n/g, "\n")
                  }
                />
              </Grid>

              {/* Temp */}
              <p>{JSON.stringify(output)}</p>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
