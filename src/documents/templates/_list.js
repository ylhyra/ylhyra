import Audio from "documents/templates/Audio";
import Book from "documents/templates/Book";
import Button from "documents/templates/Button";
import Chapter from "documents/templates/Chapter";
import Collapse from "documents/templates/Collapse";
import Constant from "documents/templates/Constant";
import Frontpage from "app/elements/frontpage";
import H1 from "documents/templates/H1";
import Image from "documents/templates/Image";
import Instagram from "documents/templates/Instagram";
import Level from "documents/templates/Level";
import Login from "app/user/LoginForm";
import PWYW from "app/user/payments/Pay";
import Parts from "documents/templates/Parts";
import Section from "documents/templates/Section";
import SignupSteps from "app/user/screens/SignupSteps";
import Tweet from "documents/templates/Tweet";
import VocabularyHeader from "app/vocabulary/elements/VocabularyHeader";

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
};
const lowercaseKeyToTemplate = {};
Object.keys(template).forEach((key) => {
  lowercaseKeyToTemplate[key.toLowerCase()] = template[key];
});

export default (name) => {
  return lowercaseKeyToTemplate[name.toLowerCase()] || null;
};
