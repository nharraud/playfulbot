import { GameState } from "src/types/gameState";

interface GameProps {
  game: {
    gameState: GameState;
  };
}

export interface StringChildrenProps {
  children: string
}

export interface RulesProps {
  SectionTitle: (props: StringChildrenProps) => JSX.Element
  SectionParagraph: (props: StringChildrenProps) => JSX.Element
  CodeBlock: (props: StringChildrenProps) => JSX.Element
}

export interface GameDefinition {
  game: (props: GameProps) => JSX.Element,
  rules: (props: RulesProps) => JSX.Element,
}
