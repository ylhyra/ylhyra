import Frontpage from "app/Elements/Frontpage";
import Level from "documents/Templates/Level";
import Book from "documents/Templates/Book";
import Blær from "documents/Templates/Blær";
import Image from "documents/Templates/Image";
import Button from "documents/Templates/Button";
import VocabularyStatus from "documents/Templates/VocabularyStatus";
import Audio from "documents/Templates/Audio";
import H1 from "documents/Templates/H1";
import Section from "documents/Templates/Section";
import VocabularyHeader from "app/Vocabulary/Elements/VocabularyHeader";

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
    case "blær":
      return Blær;
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
    default:
      return null;
  }
};
