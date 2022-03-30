"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postponeRelatedCards = void 0;
const card_dependencies_1 = require("app/vocabulary/actions/card/card_dependencies");
const card_difficulty_1 = require("app/vocabulary/actions/card/card_difficulty");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const card_siblings_1 = require("app/vocabulary/actions/card/card_siblings");
const constants_1 = require("app/vocabulary/constants");
/**
 * @memberOf CardInSession#
 */
function postponeRelatedCards(card1interval) {
    const card1 = this;
    this.getOtherCardsInSession().forEach((card2) => {
        // Same term
        if ((0, card_dependencies_1.hasTermsInCommonWith)(card1.getId(), card2.getId())) {
            if (card1.history.includes(constants_1.BAD) || card2.history.includes(constants_1.BAD)) {
                card2.done = false;
            }
            else {
                card2.done = true;
            }
            if (card1.history[0] >= constants_1.GOOD) {
                card2.showIn({ minInterval: 8 });
            }
            else if (card1.history[0] === constants_1.BAD) {
                if (card1.history[1] === constants_1.BAD && !(card2.history[0] >= constants_1.GOOD)) {
                    card1.showIn({ interval: card1interval + 1 });
                    card2.showIn({ interval: card1interval });
                }
                else {
                    card2.showIn({ interval: card1interval });
                }
            }
        }
        // Cards that directly rely on this card
        else if ((0, card_dependencies_1.dependencyDepthOfCard)(card2.getId(), card1.getId()) >= 1) {
            let min = (0, card_dependencies_1.dependencyDepthOfCard)(card2.getId(), card1.getId()) * 3;
            if (card1.history[0] === constants_1.BAD) {
                min *= 2;
                if ((0, card_dependencies_1.dependencyDepthOfCard)(card2.getId(), card1.getId()) >= 2) {
                    card2.done = true;
                }
            }
            card2.showIn({
                minInterval: min,
                cannotBeShownBefore: min,
            });
        }
        // Cards that this card depends directly on
        else if (card1.history[0] === constants_1.BAD &&
            (0, card_dependencies_1.dependencyDepthOfCard)(card1.getId(), card2.getId()) === 1 &&
            // And other card is new
            ((!(0, card_schedule_1.isInSchedule)(card2.getId()) && !card2.hasBeenSeenInSession()) ||
                // Or other card is bad (includes some randomness)
                (((0, card_difficulty_1.isBad)(card2.getId()) || card2.history[0] === constants_1.BAD) &&
                    Math.random() > 0.5))) {
            card1.showIn({ interval: 6 });
            card2.showIn({ interval: 3 });
            (0, card_siblings_1.getSiblingCardsInSession)(card2.getId()).forEach((sibling_card) => {
                sibling_card.showIn({ interval: 6 });
            });
        }
        // Cards that share the same dependencies
        else if ((0, card_dependencies_1.hasDependenciesInCommonWith)(card1.getId(), card2.getId())) {
            card2.showIn({ cannotBeShownBefore: 2 });
            // log(`"${printWord(card2.id)}" postponed`);
        }
        // // Overlap in card text (such as in the English translations)
        // else if (isTextSimilarTo(card1.getId(), card2.getId())) {
        //   card2.showIn({ cannotBeShownBefore: 2 });
        //   // log(
        //   //   `"${card2.printWord()}" postponed as it's similar to "${card1.printWord()}"`
        //   // );
        //   // log(card2.phoneticHashArray, card1.phoneticHashArray);
        // }
    });
}
exports.postponeRelatedCards = postponeRelatedCards;
