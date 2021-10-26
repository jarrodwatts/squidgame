import GameStatus from "./GameStatus";
import Player from "./Player";
import Question from "./Question";

export default interface Game {
  id: string;
  startTime: Date;
  players: Player[];
  questions: Question[];
  status: GameStatus;
}
