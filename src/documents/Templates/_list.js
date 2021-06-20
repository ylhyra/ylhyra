import Level from "documents/Templates/Level";
import Book from "documents/Templates/Book";
import Blær from "documents/Templates/Blær";
import Image from "documents/Templates/Image";
import Button from "documents/Templates/Button";
import VocabularyStatus from "documents/Templates/VocabularyStatus";
import Audio from "documents/Templates/Audio";

export default (name) => {
  switch (name.toLowerCase()) {
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
    default:
      return null;
  }
};
