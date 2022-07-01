import { Frontpage } from "flashcards/app/frontpage";
import { FlashcardsMake } from "flashcards/flashcards";
import { FlashcardsEdit } from "flashcards/flashcards/editor/edit";
import { FlashcardsPlay } from "flashcards/flashcards/play";
import { Login } from "flashcards/user/login/login";
import { observer } from "mobx-react";
import { history } from "modules/router";
import UrlPattern from "url-pattern";

export const Routes = observer(() => {
  let items = [
    {
      path: "/",
      component: Frontpage,
    },
    {
      path: "/login",
      component: Login,
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

  for (const item of items) {
    const match = new UrlPattern(item.path).match(history!.location.pathname);
    if (match) {
      return <item.component {...match} />;
    }
  }

  return <div>Not found</div>;
});
