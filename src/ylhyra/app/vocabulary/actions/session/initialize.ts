import { syncIfNecessary } from "ylhyra/app/vocabulary/actions/userData/sync";

/**
 * @memberOf Session#
 */
export async function InitializeSession(options: any = {}) {
  await syncIfNecessary();
  if (options.shouldReset !== false) {
    this.reset();
  }
  this.checkIfCardsRemaining();
  this.nextCard();
  this.loadCardInInterface();
}
