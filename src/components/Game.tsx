import React, { ReactElement } from "react";

interface Props {}
/**
 * Elements of a game:
 * - id
 * - status (waiting for players, started, etc)
 * - players
 * - questions
 */

/**
 * Order of what happens:
 * Players sign in and join the game from the homepage joinGame()
 *  - Tick a shared timer down until 0 seconds remain, startGame()
 *  - Once game started, generate questions generateQuestions()
 *  - Also generateScoreboard()
 *  - Once questions generated, distributeQuestionsToPlayers()
 *  - beginTimer() ?
 *  - Players write code and call submitQuestion()
 *  - submitQuestion calls runCode()
 *  - Somehow tests cases are run on the submitted code
 *  - Is last question?
 *  - -> Yes: Win game for this player
 *  - -> No:
 *  - Is Code correct?
 *  - -> Yes: Serve next question
 *  - -> No: eliminatePlayer()
 *          -> updateScoreboard()
 *
 */
export default function Game({}: Props): ReactElement {
  return <div></div>;
}
