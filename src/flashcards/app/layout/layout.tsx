import { Header } from "flashcards/app/layout/header";
import React, { PropsWithChildren } from "react";

export const Layout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto p-4 text-sm">{children}</main>
    </>
  );
};
