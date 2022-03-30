import store from "app/app/store";
import Link from "app/router/Link";
import React from "react";

export default () => (
  <div>
    <Link href="/vocabulary">Exit</Link>
    <div>Done for today!</div>
    <div>
      <button
        onClick={() => store.getState().vocabulary.deck.continueStudying()}
      >
        Continue studying
      </button>
    </div>
  </div>
);
