import { logShown } from "ylhyra/documents/renderDocument/textInteractions/Reset";
import FindAGoodPositionForTooltip from "ylhyra/documents/renderDocument/textInteractions/TooltipPosition";
import AudioClip from "ylhyra/documents/renderDocument/audio/audioWithoutInterface.NOT_USED";

/*
  Keep track of which ID is currently shown.
  If the user is moving his cursor too rapidly,
  main function may still be working on an old word.
*/
let currentId;

/*
  Show word
*/
export default function showWord(id) {
  currentId = id;

  // console.log(id)
  const tooltip = document.getElementById(`${id}-tooltip`);
  if (!tooltip) return;
  tooltip.classList.add("shown");
  logShown(`${id}-tooltip`);

  if (id !== currentId) return; /* Exit if we're behind schedule */

  const element = document.getElementById(id);
  if (!element) return;
  element.classList.add("hover");
  logShown(id);

  if (id !== currentId) return; /* Exit if we're behind schedule */

  let sound_files = element.getAttribute("data-sound");
  if (sound_files) {
    AudioClip.play(sound_files.split(","));
  }

  if (id !== currentId) return; /* Exit if we're behind schedule */

  const connected = element.getAttribute("data-connected-words");
  if (connected) {
    connected.split(",").forEach((i) => {
      addClass(i, "hover");
      logShown(i);
    });
  }

  if (id !== currentId) return; /* Exit if we're behind schedule */

  const { top, left } = FindAGoodPositionForTooltip({
    relative: document.getElementById("content").getBoundingClientRect(), // The text container will have "position:relative"
    tooltip: tooltip.getBoundingClientRect(),
    sentence: element.getBoundingClientRect(),
    // sentence_multiple_lines: this.props.clientRects || null
  });

  tooltip.style.top = Math.round(top) + "px";
  tooltip.style.left = Math.round(left) + "px";

  addClass(`${id}-box`, "shown");
  logShown(`${id}-box`);
}

const addClass = (id, css) => {
  const element = document.getElementById(id);
  if (!element) return;
  element.classList.add(css);
};
