import Session from "ylhyra/app/vocabulary/actions/session/index";
import { syncIfNecessary } from "ylhyra/app/vocabulary/actions/userData/sync";

/**
 * @memberOf Session#
 */
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
