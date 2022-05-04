import { Frontpage } from "flashcards/app/frontpage";
import { FlashcardsMake } from "flashcards/flashcards/make";
import { FlashcardsEdit } from "flashcards/flashcards/make/edit";
import { FlashcardsPlay } from "flashcards/flashcards/play";
import React from "react";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

export const Routes = () => (
  <ReactRouterRoutes>
    <Route path="/" element={<Frontpage />} />
    <Route path="/flashcards" element={<FlashcardsMake />} />
    <Route path="/flashcards/deck/:deckId" element={<FlashcardsEdit />} />
    <Route path="/flashcards/play/:deckId" element={<FlashcardsPlay />} />
    {/*<Route path="/friends/:friendUserId" element={<FriendProfile />} />*/}
  </ReactRouterRoutes>
);
