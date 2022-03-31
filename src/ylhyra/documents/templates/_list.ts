import Frontpage from "ylhyra/app/elements/frontpage";
import Login from "ylhyra/app/user/LoginForm";
import PWYW from "ylhyra/app/user/payments/Pay";
import SignupSteps from "ylhyra/app/user/screens/SignupSteps";
import VocabularyHeader from "ylhyra/app/vocabulary/elements/InArticles/VocabularyHeader";
import Audio from "ylhyra/documents/templates/Audio";
import Book from "ylhyra/documents/templates/Book";
import Button from "ylhyra/documents/templates/Button";
import Chapter from "ylhyra/documents/templates/Chapter";
import Collapse from "ylhyra/documents/templates/Collapse";
import Constant from "ylhyra/documents/templates/Constant";
import H1 from "ylhyra/documents/templates/H1";
import Image from "ylhyra/documents/templates/Image";
import Instagram from "ylhyra/documents/templates/Instagram";
import Level from "ylhyra/documents/templates/Level";
import Parts from "ylhyra/documents/templates/Parts";
import Section from "ylhyra/documents/templates/Section";
import Spacer from "ylhyra/documents/templates/Spacer";
import Tweet from "ylhyra/documents/templates/Tweet";

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
};
const lowercaseKeyToTemplate = {};
Object.keys(template).forEach((key) => {
  lowercaseKeyToTemplate[key.toLowerCase()] = template[key];
});

export default (name) => {
  return lowercaseKeyToTemplate[name.toLowerCase()] || null;
};
