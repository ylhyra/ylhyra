import { syncIfNecessary } from "app/vocabulary/actions/userData/sync";

/**
 * @memberOf Session#
 */
export async function InitializeSession(options = {}) {
  await syncIfNecessary();
  if (options.shouldReset !== false) {
    this.reset();
  }
  this.checkIfCardsRemaining();
  this.nextCard();
  this.loadCardInInterface();
}
