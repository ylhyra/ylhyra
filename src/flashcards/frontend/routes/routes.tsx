import Frontpage from "flashcards/frontend/routes/frontpage";
import React from "react";
import { Route, Routes } from "react-router-dom";

export default function () {
  return (
    <Routes>
      <Route path="/" element={<Frontpage />} />
      {/*<Route path="/friends/:friendUserId" element={<FriendProfile />} />*/}
    </Routes>
  );
}
