import GameStatus from "./GameStatus";

export default interface Game {
  id: string;
  players: Player[];
  questions: Question[];
  status: GameStatus;
}
