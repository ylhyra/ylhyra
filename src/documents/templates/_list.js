import Frontpage from "app/elements/frontpage";
import Level from "documents/templates/Level";
import Book from "documents/templates/Book";
import Image from "documents/templates/Image";
import Button from "documents/templates/Button";
import Chapter from "documents/templates/Chapter";
import VocabularyHeader from "app/vocabulary/elements/VocabularyHeader";
import Audio from "documents/templates/Audio";
import H1 from "documents/templates/H1";
import Section from "documents/templates/Section";
import PWYW from "app/user/payments/Pay";
import SignupSteps from "app/user/screens/SignupSteps";
import Tweet from "documents/templates/Tweet";
import Parts from "documents/templates/Parts";
import Instagram from "documents/templates/Instagram";
import Collapse from "documents/templates/Collapse";
import Login from "app/user/LoginForm";
import Constant from "app/user/LoginForm";

export default async (name) => {
  switch (name.toLowerCase()) {
    case "frontpage":
      return Frontpage;
      break;
    case "constant":
      return Constant;
      break;
    case "level":
      return Level;
      break;
    case "book":
      return Book;
      break;
    case "image":
      return Image;
      break;
    case "button":
      return Button;
      break;
    case "chapter":
      return Chapter;
      break;
    case "audio":
      return Audio;
      break;
    case "section":
      return Section;
      break;
    case "h1":
      return H1;
      break;
    case "vocabularyheader":
      return VocabularyHeader;
      break;
    case "pwyw":
      return PWYW;
      break;
    case "signupsteps":
      return SignupSteps;
      break;
    case "tweet":
      return Tweet;
      break;
    case "parts":
      return Parts;
      break;
    case "instagram":
      return Instagram;
      break;
    case "collapse":
      return Collapse;
      break;
    case "login":
      return Login;
      break;

    default:
      return null;
  }
};
