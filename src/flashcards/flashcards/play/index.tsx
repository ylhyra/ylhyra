import { initializeSession } from "flashcards/flashcards/actions/session/initialize";
import { getFlashcardsStore } from "flashcards/flashcards/flashcardsStore";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

export const FlashcardsPlay = observer(function () {
  let { deckId } = useParams<{ deckId: string }>();
  const deck = getDeckById(deckId!);
  if (!deck) return <div>No deck with that id.</div>;

  useEffect(() => {
    void initializeSession({ deckId });
  }, [deckId]);

  return (
    <div id="vocabulary-screen">
      <div id="vocabulary-screen-inner">
        {/*<div id="vocabulary-header">*/}
        {/*  <button className="link" onClick={() => session?.sessionDone()}>*/}
        {/*    Quit*/}
        {/*  </button>*/}
        {/*  <div>&nbsp;&nbsp;•&nbsp;&nbsp;</div>*/}
        {/*  <button*/}
        {/*    className="link"*/}
        {/*    onClick={() => {*/}
        {/*      goToUrl("/vocabulary/tutorial", {*/}
        {/*        dontChangeUrl: true,*/}
        {/*      });*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Tutorial*/}
        {/*  </button>*/}
        {/*  {session.undoable() && [*/}
        {/*    <div key={1}>&nbsp;&nbsp;•&nbsp;&nbsp;</div>,*/}
        {/*    <button*/}
        {/*      key={2}*/}
        {/*      className="link"*/}
        {/*      onClick={() => {*/}
        {/*        session.undo();*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Undo*/}
        {/*    </button>,*/}
        {/*  ]}*/}
        {/*  <div className="spacer" />*/}
        {/*  {session?.cards.some((j) => getSound(j.getId())) && (*/}
        {/*    <button*/}
        {/*      className="link"*/}
        {/*      onClick={() => {*/}
        {/*        store.dispatch({ type: "VOCABULARY_AUDIO_ONOFF" });*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      Audio: <b>{this.props.vocabulary.volume ? "On" : "Off"}</b>*/}
        {/*    </button>*/}
        {/*  )}*/}
        {/*</div>*/}

        <div id="game-container">
          <div className="vocabulary-card-outer-container">
            {/*<Card key={card.counter} />*/}
          </div>
          {/*<Progress />*/}
        </div>
      </div>
    </div>
  );
});

// class RunningScreen extends Component<{ vocabulary: any }> {
//   componentDidMount = () => {
//     this.componentDidUpdate();
//     window.addEventListener("keydown", this.checkKey);
//   };
//   componentDidUpdate = () => {
//     const { deck } = this.props.vocabulary;
//     if (!deck!.session.currentCard) {
//       log(
//         "No current cardInSession when GameContainer was loaded, initializing"
//       );
//       deck!.session.initializeSession(); //tmp!
//     }
//   };
//   componentWillUnmount() {
//     window.removeEventListener("keydown", this.checkKey);
//   }
//   checkKey = (e: KeyboardEvent) => {
//     this.props.vocabulary.deck?.session?.checkForUndoOnKeyDown(e);
//   };
//   render() {
//     if (!getUserLevel()) {
//       return <SelectLevelScreen />;
//     }
//     const session: session = getSession().props.vocabulary.deck?.session;
//     if (!session) return null;
//     const { card } = this.props.vocabulary;
//     if (!card) return null;
//     return (
//       <div id="vocabulary-screen">
//         <div id="vocabulary-screen-inner">
//           <div id="vocabulary-header">
//             <button className="link" onClick={() => session?.sessionDone()}>
//               Quit
//             </button>
//             <div>&nbsp;&nbsp;•&nbsp;&nbsp;</div>
//             <button
//               className="link"
//               onClick={() => {
//                 goToUrl("/vocabulary/tutorial", {
//                   dontChangeUrl: true,
//                 });
//               }}
//             >
//               Tutorial
//             </button>
//             {session.undoable() && [
//               <div key={1}>&nbsp;&nbsp;•&nbsp;&nbsp;</div>,
//               <button
//                 key={2}
//                 className="link"
//                 onClick={() => {
//                   session.undo();
//                 }}
//               >
//                 Undo
//               </button>,
//             ]}
//             <div className="spacer" />
//             {session?.cards.some((j) => getSound(j.getId())) && (
//               <button
//                 className="link"
//                 onClick={() => {
//                   store.dispatch({ type: "VOCABULARY_AUDIO_ONOFF" });
//                 }}
//               >
//                 Audio: <b>{this.props.vocabulary.volume ? "On" : "Off"}</b>
//               </button>
//             )}
//           </div>
//
//           <div id="game-container">
//             <div className="vocabulary-card-outer-container">
//               <Card key={card.counter} />
//             </div>
//             <Progress />
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
