import { Frontpage } from "flashcards/app/frontpage";
import { FlashcardsMake } from "flashcards/flashcards";
import { FlashcardsEdit } from "flashcards/flashcards/editor/edit";
import { FlashcardsPlay } from "flashcards/flashcards/play";
import { observer } from "mobx-react";
import { history } from "modules/router";
import { Switch } from "react-history-switch";

export const Routes = observer(() => {
  let items = [
    {
      path: "/",
      component: Frontpage,
    },
    {
      path: "/flashcards",
      component: FlashcardsMake,
    },
    {
      path: "/flashcards/deck/:deckId",
      component: FlashcardsEdit,
    },
    {
      path: "/flashcards/play/:deckId",
      component: FlashcardsPlay,
    },
  ];
  return <Switch history={history!} items={items} />;
});
