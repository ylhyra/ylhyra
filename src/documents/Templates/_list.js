import Level from "documents/Templates/Level";
import Book from "documents/Templates/Book";
import Blær from "documents/Templates/Blær";
import Image from "documents/Templates/Image";
import Button from "documents/Templates/Button";
import VocabularyStatus from "documents/Templates/VocabularyStatus";
import Audio from "documents/Templates/Audio";

export default (name) => {
  switch (name) {
    case "Level":
      return Level;
      break;
    case "Book":
      return Book;
      break;
    case "Blær":
      return Blær;
      break;
    case "Image":
      return Image;
      break;
    case "Button":
      return Button;
      break;
    case "VocabularyStatus":
      return VocabularyStatus;
      break;
    case "Audio":
      return Audio;
      break;
    default:
      return null;
  }
};
