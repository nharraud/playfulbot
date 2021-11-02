import { GameID, GameState } from "./common";

export interface GameRendererProps<GState extends GameState> {
  gameState: GState;
}

export type GameRenderer<GState extends GameState> = (props: GameRendererProps<GState>) => JSX.Element;

export interface StringChildrenProps {
  children: string
}

export interface RulesProps {
  SectionTitle: (props: StringChildrenProps) => JSX.Element
  SectionParagraph: (props: StringChildrenProps) => JSX.Element
  CodeBlock: (props: StringChildrenProps) => JSX.Element
}

export interface GameDefinition<GState extends GameState> {
  game: GameRenderer<GState>,
  rules: (props: RulesProps) => JSX.Element,
  playerColor: (playerNumber: number) => string,
}
