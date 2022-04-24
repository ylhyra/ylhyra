import Frontpage from "ylhyra/app/elements/frontpage";
import Login from "ylhyra/app/user/LoginForm";
import PWYW from "ylhyra/app/user/payments/Pay";
import SignupSteps from "ylhyra/app/user/screens/SignupSteps";
import Audio from "ylhyra/documents/renderDocument/templates/Audio";
import Book from "ylhyra/documents/renderDocument/templates/Book";
import Button from "ylhyra/documents/renderDocument/templates/Button";
import Chapter from "ylhyra/documents/renderDocument/templates/Chapter";
import Collapse from "ylhyra/documents/renderDocument/templates/Collapse";
import Constant from "ylhyra/documents/renderDocument/templates/Constant";
import H1 from "ylhyra/documents/renderDocument/templates/H1";
import Image from "ylhyra/documents/renderDocument/templates/Image";
import Instagram from "ylhyra/documents/renderDocument/templates/Instagram";
import Level from "ylhyra/documents/renderDocument/templates/Level";
import Parts from "ylhyra/documents/renderDocument/templates/Parts";
import Section from "ylhyra/documents/renderDocument/templates/Section";
import Spacer from "ylhyra/documents/renderDocument/templates/Spacer";
import Tweet from "ylhyra/documents/renderDocument/templates/Tweet";
import VocabularyHeader from "ylhyra/vocabulary/app/elements/InArticles/VocabularyHeader";

const template = {
  Audio: Audio,
  Book: Book,
  Button: Button,
  Chapter: Chapter,
  Collapse: Collapse,
  Constant: Constant,
  Frontpage: Frontpage,
  H1: H1,
  Image: Image,
  Instagram: Instagram,
  Level: Level,
  Login: Login,
  PWYW: PWYW,
  Parts: Parts,
  Section: Section,
  SignupSteps: SignupSteps,
  Tweet: Tweet,
  VocabularyHeader: VocabularyHeader,
  Spacer: Spacer,
} as const;
const lowercaseKeyToTemplate = {};
Object.keys(template).forEach((key) => {
  // @ts-ignore
  lowercaseKeyToTemplate[key.toLowerCase()] = template[key];
});

export default (name: string) => {
  // @ts-ignore
  return lowercaseKeyToTemplate[name.toLowerCase()] || null;
};
