import FlashcardsMake from "flashcards/flashcards/make/index";
import Frontpage from "flashcards/frontend/routes/frontpage";
import React from "react";
import { Route, Routes } from "react-router-dom";

export default function () {
  return (
    <Routes>
      <Route path="/" element={<Frontpage />} />
      <Route path="/flashcards" element={<FlashcardsMake />} />
      {/*<Route path="/friends/:friendUserId" element={<FriendProfile />} />*/}
    </Routes>
  );
}
