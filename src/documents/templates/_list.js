"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const frontpage_1 = __importDefault(require("app/elements/frontpage"));
const LoginForm_1 = __importDefault(require("app/user/LoginForm"));
const Pay_1 = __importDefault(require("app/user/payments/Pay"));
const SignupSteps_1 = __importDefault(require("app/user/screens/SignupSteps"));
const VocabularyHeader_1 = __importDefault(require("app/vocabulary/elements/InArticles/VocabularyHeader"));
const Audio_1 = __importDefault(require("documents/templates/Audio"));
const Book_1 = __importDefault(require("documents/templates/Book"));
const Button_1 = __importDefault(require("documents/templates/Button"));
const Chapter_1 = __importDefault(require("documents/templates/Chapter"));
const Collapse_1 = __importDefault(require("documents/templates/Collapse"));
const Constant_1 = __importDefault(require("documents/templates/Constant"));
const H1_1 = __importDefault(require("documents/templates/H1"));
const Image_1 = __importDefault(require("documents/templates/Image"));
const Instagram_1 = __importDefault(require("documents/templates/Instagram"));
const Level_1 = __importDefault(require("documents/templates/Level"));
const Parts_1 = __importDefault(require("documents/templates/Parts"));
const Section_1 = __importDefault(require("documents/templates/Section"));
const Spacer_1 = __importDefault(require("documents/templates/Spacer"));
const Tweet_1 = __importDefault(require("documents/templates/Tweet"));
const template = {
    Audio: Audio_1.default,
    Book: Book_1.default,
    Button: Button_1.default,
    Chapter: Chapter_1.default,
    Collapse: Collapse_1.default,
    Constant: Constant_1.default,
    Frontpage: frontpage_1.default,
    H1: H1_1.default,
    Image: Image_1.default,
    Instagram: Instagram_1.default,
    Level: Level_1.default,
    Login: LoginForm_1.default,
    PWYW: Pay_1.default,
    Parts: Parts_1.default,
    Section: Section_1.default,
    SignupSteps: SignupSteps_1.default,
    Tweet: Tweet_1.default,
    VocabularyHeader: VocabularyHeader_1.default,
    Spacer: Spacer_1.default,
};
const lowercaseKeyToTemplate = {};
Object.keys(template).forEach((key) => {
    lowercaseKeyToTemplate[key.toLowerCase()] = template[key];
});
exports.default = (name) => {
    return lowercaseKeyToTemplate[name.toLowerCase()] || null;
};
