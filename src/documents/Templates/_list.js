import Frontpage from "app/Elements/Frontpage";
import Level from "documents/Templates/Level";
import Book from "documents/Templates/Book";
import Image from "documents/Templates/Image";
import Button from "documents/Templates/Button";
import VocabularyStatus from "documents/Templates/VocabularyStatus";
import VocabularyHeader from "documents/Templates/VocabularyHeaderWrapper";
import Audio from "documents/Templates/Audio";
import H1 from "documents/Templates/H1";
import Section from "documents/Templates/Section";
import PWYW from "app/User/screens/Pay";
import SignupSteps from "app/User/screens/SignupSteps";
import Tweet from "documents/Templates/Tweet";
import Parts from "documents/Templates/Parts";
import Instagram from "documents/Templates/Instagram";

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
    case "vocabularystatus":
      return VocabularyStatus;
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

    default:
      return null;
  }
};
