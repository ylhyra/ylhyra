import Frontpage from "app/Elements/Frontpage";
import Level from "documents/Templates/Level";
import Book from "documents/Templates/Book";
import Image from "documents/Templates/Image";
import Button from "documents/Templates/Button";
import Chapter from "documents/Templates/Chapter";
import VocabularyHeader from "app/Vocabulary/Elements/VocabularyHeader";
import Audio from "documents/Templates/Audio";
import H1 from "documents/Templates/H1";
import Section from "documents/Templates/Section";
import PWYW from "app/User/screens/Pay";
import SignupSteps from "app/User/screens/SignupSteps";
import Tweet from "documents/Templates/Tweet";
import Parts from "documents/Templates/Parts";
import Instagram from "documents/Templates/Instagram";
import Collapse from "documents/Templates/Collapse";
import Login from "app/User/LoginForm";
export default (name) => {
  switch (name.toLowerCase()) {
    case "frontpage":
      return Frontpage;
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
