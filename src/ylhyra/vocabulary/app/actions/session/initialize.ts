import Session from "ylhyra/vocabulary/app/actions/session/index";
import { syncIfNecessary } from "ylhyra/vocabulary/app/actions/userData/sync";

export async function initializeSession(
  this: Session,
  options: { shouldReset?: Boolean } = {}
) {
  await syncIfNecessary();
  if (options.shouldReset !== false) {
    this.reset();
  }
  this.checkIfCardsRemaining();
  this.nextCard();
  this.loadCardInInterface();
}
