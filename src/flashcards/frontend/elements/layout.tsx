import Header from "flashcards/frontend/elements/header";
import React from "react";

export default ({ children }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 text-sm">{children}</main>
    </>
  );
};