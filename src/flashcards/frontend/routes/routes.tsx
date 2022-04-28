import { FlashcardsEdit } from "flashcards/flashcards/make/edit";
import { FlashcardsMake } from "flashcards/flashcards/make/index";
import { Frontpage } from "flashcards/frontend/routes/frontpage";
import React from "react";
import { Route, Routes as ReactRouterRoutes } from "react-router-dom";

export const Routes = () => (
  <ReactRouterRoutes>
    <Route path="/" element={<Frontpage />} />
    <Route path="/flashcards" element={<FlashcardsMake />} />
    <Route path="/flashcards/deck/:deckId" element={<FlashcardsEdit />} />
    {/*<Route path="/friends/:friendUserId" element={<FriendProfile />} />*/}
  </ReactRouterRoutes>
);
