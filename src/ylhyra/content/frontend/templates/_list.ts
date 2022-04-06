import Frontpage from "ylhyra/app/elements/frontpage";
import Login from "ylhyra/app/user/LoginForm";
import PWYW from "ylhyra/app/user/payments/Pay";
import SignupSteps from "ylhyra/app/user/screens/SignupSteps";
import VocabularyHeader from "ylhyra/vocabulary/app/elements/InArticles/VocabularyHeader";
import Audio from "ylhyra/content/frontend/templates/Audio";
import Book from "ylhyra/content/frontend/templates/Book";
import Button from "ylhyra/content/frontend/templates/Button";
import Chapter from "ylhyra/content/frontend/templates/Chapter";
import Collapse from "ylhyra/content/frontend/templates/Collapse";
import Constant from "ylhyra/content/frontend/templates/Constant";
import H1 from "ylhyra/content/frontend/templates/H1";
import Image from "ylhyra/content/frontend/templates/Image";
import Instagram from "ylhyra/content/frontend/templates/Instagram";
import Level from "ylhyra/content/frontend/templates/Level";
import Parts from "ylhyra/content/frontend/templates/Parts";
import Section from "ylhyra/content/frontend/templates/Section";
import Spacer from "ylhyra/content/frontend/templates/Spacer";
import Tweet from "ylhyra/content/frontend/templates/Tweet";

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
