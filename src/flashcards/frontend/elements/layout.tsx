import { Header } from "flashcards/frontend/elements/header";
import React from "react";

export const Layout: React.FC = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 text-sm">{children}</main>
    </>
  );
};
