"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const simplePlural_1 = require("app/app/functions/simplePlural");
const paths_1 = require("app/app/paths");
const store_1 = __importDefault(require("app/app/store"));
const card_data_1 = require("app/vocabulary/actions/card/card_data");
const card_schedule_1 = require("app/vocabulary/actions/card/card_schedule");
const deck_1 = require("app/vocabulary/actions/deck");
const constants_1 = require("app/vocabulary/constants");
const AudioClip_1 = __importDefault(require("documents/render/audio/AudioClip"));
const react_1 = require("react");
const react_redux_1 = require("react-redux");
class CardElement extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {};
        this.keyUp = () => {
            this.isKeyDown = false;
        };
        this.checkKey = (e) => {
            if (e.metaKey || e.ctrlKey || e.altKey)
                return;
            if (this.isKeyDown)
                return;
            const { answered } = this.props.vocabulary.card;
            this.isKeyDown = true;
            if (e.keyCode === 32 /* Space */ || e.keyCode === 13 /* Enter */) {
                if (answered) {
                    this.answer(constants_1.GOOD);
                }
                else {
                    this.show();
                }
                e.preventDefault();
            }
            else if ([49 /* One */, 74 /* J */, 65 /* A */, 37 /* Left */].includes(e.keyCode)) {
                if (answered) {
                    this.answer(constants_1.BAD);
                }
                else {
                    this.show();
                }
                e.preventDefault();
            }
            else if ([50 /* Two */, 75 /* K */, 83 /* S */, 40 /* Down */].includes(e.keyCode)) {
                if (answered) {
                    this.answer(constants_1.GOOD);
                }
                else {
                    this.show();
                }
                e.preventDefault();
            }
            else if ([51 /* Three */, 76 /* L */, 68 /* D */, 39 /* Right */].includes(e.keyCode)) {
                if (answered) {
                    this.answer(constants_1.EASY);
                }
                else {
                    this.show();
                }
                e.preventDefault();
            }
            // log(e.keyCode)
        };
        this.answer = (i, timeout, e) => {
            e === null || e === void 0 ? void 0 : e.stopPropagation();
            if (this.state.answer)
                return;
            const { session } = this.props.vocabulary.deck;
            if (timeout === false) {
                session.answer(i);
            }
            else {
                this.setState({
                    answer: i,
                });
                setTimeout(() => {
                    session.answer(i);
                }, 100);
            }
        };
        this.sound = (answered) => {
            const { volume } = this.props.vocabulary;
            const card = deck_1.deck.session.currentCard;
            if (!card)
                return;
            const id = card.getId();
            if (volume && (0, card_data_1.getSound)(id) && ((0, card_data_1.getFrom)(id) === "is" || answered)) {
                try {
                    AudioClip_1.default.play((0, card_data_1.getSound)(id).map((s) => (0, paths_1.get_processed_image_url)(s + ".mp3", true)));
                }
                catch (e) {
                    console.warn(e);
                }
            }
            else {
                AudioClip_1.default.pause();
            }
        };
        this.show = (timeout) => {
            if (this.props.vocabulary.card.answered) {
                this.sound(true);
                return;
            }
            if (timeout === false) {
                store_1.default.dispatch({
                    type: "ANSWER_CARD",
                });
            }
            else {
                this.setState({
                    clickingOnShowButton: true,
                });
                setTimeout(() => {
                    store_1.default.dispatch({
                        type: "ANSWER_CARD",
                    });
                }, 50);
            }
            this.sound(true);
        };
    }
    componentDidMount() {
        this.componentDidUpdate();
        window.addEventListener("keydown", this.checkKey);
        window.addEventListener("keyup", this.keyUp);
    }
    componentWillUnmount() {
        window.removeEventListener("keydown", this.checkKey);
        window.addEventListener("keyup", this.keyUp);
    }
    componentDidUpdate(prevProps) {
        const { card } = this.props.vocabulary;
        const prevCard = prevProps === null || prevProps === void 0 ? void 0 : prevProps.vocabulary.card;
        if (!prevProps || card.counter !== prevCard.counter) {
            this.setState({
                answer: null,
                clickingOnShowButton: null,
            });
            this.sound();
        }
    }
    render() {
        const { volume, deck } = this.props.vocabulary;
        const { answered } = this.props.vocabulary.card;
        const card = deck.session.currentCard;
        if (!card)
            return (0, jsx_runtime_1.jsx)("div", { children: "Unable to create cards. Please report this error." });
        const id = card.getId();
        let from = (0, card_data_1.getFrom)(id);
        let lemmas = (0, card_data_1.getData)(id, "lemmas");
        let note_regarding_english = (0, card_data_1.getData)(id, "note_regarding_english");
        let note = (0, card_data_1.getData)(id, "note");
        let literally = (0, card_data_1.getData)(id, "literally");
        let example_declension = (0, card_data_1.getData)(id, "example_declension");
        let pronunciation = (0, card_data_1.getData)(id, "pronunciation");
        let synonyms = (0, card_data_1.getData)(id, "synonyms");
        const is = (0, card_data_1.getData)(id, "is_formatted");
        const en = (0, card_data_1.getData)(id, "en_formatted");
        /* Loading */
        if (!is) {
            return null;
        }
        literally = label("Literally", literally);
        synonyms = label((0, simplePlural_1.withPlural)(/,/.test(synonyms), "Synonym"), synonyms);
        lemmas = label((0, simplePlural_1.withPlural)(/,/.test(lemmas), "Dictionary form"), lemmas);
        example_declension = label("Example declension", example_declension);
        pronunciation = label("Pronounced", pronunciation && `<i>${pronunciation}</i>`);
        note = label("Note", note);
        note_regarding_english = label("Note", note_regarding_english);
        return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: `
          vocabulary-card
          flashcard
          ${answered ? "answered" : "not-answered"}
          ${(0, card_data_1.getSound)(id) && volume ? "has-sound" : ""}
          ${(0, card_schedule_1.isNewTerm)(id) ? "new" : ""}
        `, onClick: () => this.show(false) }, { children: [(0, jsx_runtime_1.jsxs)("div", Object.assign({ className: `
          flashcard-top
          flashcard-prompt-${from === "is" ? "icelandic" : "english"}
        ` }, { children: [(0, card_data_1.getSound)(id) && (0, jsx_runtime_1.jsx)("div", { className: "has-audio-icon" }), (0, jsx_runtime_1.jsx)("div", { children: html(from === "is" ? is : en) })] })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: `
          flashcard-bottom
          flashcard-prompt-${from !== "is" ? "icelandic" : "english"}
        ` }, { children: (answered || /"occluded/.test(from !== "is" ? is : en)) && ((0, jsx_runtime_1.jsx)("div", { children: html(from !== "is" ? is : en) })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "card-notes" }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "card-notes-inner" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: from === "en" ? "" : "show-after-answer" }, { children: note_regarding_english })), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "show-after-answer" }, { children: [note, literally, lemmas, example_declension, synonyms, pronunciation] }))] })) })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "flashcard-buttons" }, { children: !answered ? ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("button", Object.assign({ className: `
              not-answered
              button-show-answer
              nostyle
              ${this.state.clickingOnShowButton ? "selected" : ""}
            ` }, { children: "Click to show answer" })) })) : ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", Object.assign({ className: "button-bad nostyle " +
                                    (this.state.answer === constants_1.BAD ? "selected" : ""), onClick: (e) => this.answer(constants_1.BAD, false, e) }, { children: "Bad" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "button-good nostyle " +
                                    (this.state.answer === constants_1.GOOD ? "selected" : ""), onClick: (e) => this.answer(constants_1.GOOD, false, e) }, { children: "Good" })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "button-easy nostyle " +
                                    (this.state.answer === constants_1.EASY ? "selected" : ""), onClick: (e) => this.answer(constants_1.EASY, false, e) }, { children: "Easy" }))] })) }))] })));
    }
}
exports.default = (0, react_redux_1.connect)((state) => ({
    vocabulary: state.vocabulary,
}))(CardElement);
const html = (text) => {
    if (!text)
        return null;
    return (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: text } });
};
// const getFontSize = (text, lang) => {
//   if (!text) return null;
//   let size = 20;
//   /*if (text.length > 70) {
//     size -= 5;
//   } else if (text.length > 50) {
//     size -= 4;
//   } else */ if (text.length > 40) {
//     size -= 3;
//   } else if (text.length > 25) {
//     size -= 2;
//   }
//   return size - (lang === "en" ? 1 : 0);
// };
const label = (name, value) => {
    if (!value)
        return null;
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "label" }, { children: [name, ":"] })), " ", html(value)] }));
};
