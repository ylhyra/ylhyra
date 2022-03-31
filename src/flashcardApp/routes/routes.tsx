import Frontpage from "flashcardApp/routes/frontpage";
import React from "react";
import { Route, Routes } from "react-router-dom";

export default function () {
  return (
    <Routes>
      <Route path="/" element={<Frontpage />} />
      {/*<Route path="/overview" element={<Overview />} />*/}
      {/*<Route path="/friends" element={<Friends />} />*/}
      {/*<Route path="/friends/:friendUserId" element={<FriendProfile />} />*/}
      {/*<Route path="/login" element={<Login />} />*/}
      {/*<Route path="/signup" element={<Login />} />*/}
    </Routes>
  );
}
