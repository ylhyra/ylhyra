import { observer } from "mobx-react";
import { getDeckById } from "flashcards/flashcards/actions/deck/functions";
import { initializeSession } from "flashcards/flashcards/actions/session/initialize";
import { CardElement } from "flashcards/flashcards/play/card";
import { FlashcardsPlayHeader } from "flashcards/flashcards/play/header";
import { ProgressBar } from "flashcards/flashcards/play/progressBar";
import { DeckId } from "flashcards/flashcards/types";
import { store } from "flashcards/store";
import React, { useEffect } from "react";

export const FlashcardsPlay = observer(({ deckId }: { deckId: string }) => {
  const deck = getDeckById(deckId as DeckId);
  if (!deck) {
    return <div>No deck with that id.</div>;
  }

  useEffect(() => {
    void initializeSession(deck);
  }, [deckId]);

  const session = store.session;
  return (
    <div id="vocabulary-screen">
      <div id="vocabulary-screen-inner">
        <FlashcardsPlayHeader />
        <div id="game-container">
          {session.userFacingError ? (
            <div id="error-message">
              <div>{session.userFacingError}</div>
            </div>
          ) : (
            <>
              <div className="flashcard-outer-container">
                {session.currentCard ? (
                  <CardElement key={session.counter} />
                ) : (
                  <div id="error-message">
                    <div>Could not generate card!</div>
                  </div>
                )}
              </div>
              {/*Todo: Key should not be needed*/}
              <ProgressBar key={session.counter} />
            </>
          )}
        </div>
      </div>
    </div>
  );
});
