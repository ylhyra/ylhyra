const padding = {
  left: 2,
  top: 2,
};

export default function FindAGoodPositionForTooltip({
  relative,
  tooltip,
  sentence,
  sentence_multiple_lines,
}) {
  if (!tooltip)
    return {
      top: undefined,
      left: undefined,
      arrow: undefined,
    };

  // let possibilities = []

  const addition = window.location.pathname.startsWith("/tweets") ? -20 : 0;

  const ofan = {
    top: sentence.top - tooltip.height - padding.top - relative.top + addition,
    left: Math.min(
      window.innerWidth - tooltip.width,
      Math.max(
        window.pageXOffset,
        sentence.left +
          sentence.width / 2 -
          tooltip.width / 2 -
          relative.left +
          addition
      )
    ),
    scoreMultiplier: 2,
    arrow: "down",
  };

  return ofan;

  // if(ofan.top >= window.pageYOffset ) {
  //   return ofan
  // } else {
  //   return {
  //     ...ofan,
  //     top: sentence.top + sentence.height + padding.top - relative.top + addition,
  //   }
  // }

  // Neðan
  // possibilities.push({
  //   top: sentence.top + sentence.height + padding.top,
  //   left: sentence.left + sentence.width / 2 - tooltip.width / 2,
  //   scoreMultiplier: 1,
  //   arrow: 'up'
  // })

  // console.log(sentence.top)
  // console.log(tooltip.height)

  // Ofan
  // possibilities.push({
  //   top: sentence.top - tooltip.height - padding.top,
  //   left: Math.max(window.pageXOffset, sentence.left + sentence.width / 2 - tooltip.width / 2),
  //   scoreMultiplier: 2,
  //   arrow: 'down'
  // })

  // // Neðan
  // possibilities.push({
  //   top: sentence.top + sentence.height + padding.top,
  //   left: sentence.left + sentence.width / 2 - tooltip.width / 2,
  //   scoreMultiplier: 1,
  //   arrow: 'up'
  // })

  // // Vinstri
  // possibilities.push({
  //   top: sentence.top + sentence.height / 2 - tooltip.height / 2,
  //   left: sentence.left - tooltip.width - padding.left,
  //   scoreMultiplier: 1,
  //   arrow: 'right'
  // })
  //
  // // Hægri
  // possibilities.push({
  //   top: sentence.top + sentence.height / 2 - tooltip.height / 2,
  //   left: sentence.left + sentence.width + padding.left,
  //   scoreMultiplier: 1,
  //   arrow: 'left'
  // })
  //
  // // Multiline
  // if (sentence_multiple_lines && sentence_multiple_lines.length > 1) {
  //   const firstInline = sentence_multiple_lines[0]
  //   const lastInline = sentence_multiple_lines[sentence_multiple_lines.length - 1]
  //
  //   // Ofan fyrstu
  //   possibilities.push({
  //     top: firstInline.top - tooltip.height - padding.top,
  //     left: firstInline.left + firstInline.width / 2 - tooltip.width / 2,
  //     scoreMultiplier: 4,
  //     arrow: 'down'
  //   })
  //
  //   // Hægri fyrstu
  //   possibilities.push({
  //     top: firstInline.top + firstInline.height / 2 - tooltip.height / 2,
  //     left: firstInline.left + firstInline.width + padding.left,
  //     scoreMultiplier: 1,
  //     arrow: 'left'
  //   })
  //
  //   // Vinstri fyrstu
  //   possibilities.push({
  //     top: firstInline.top + firstInline.height - tooltip.height,
  //     left: firstInline.left - tooltip.width - padding.left,
  //     scoreMultiplier: 10,
  //     arrow: 'bottomright'
  //   })
  //
  //
  //   // Neðan síðustu
  //   possibilities.push({
  //     top: lastInline.top + lastInline.height + padding.top,
  //     left: lastInline.left + lastInline.width / 2 - tooltip.width / 2,
  //     scoreMultiplier: 1,
  //     arrow: 'up'
  //   })
  //
  //   // Hægri síðustu
  //   possibilities.push({
  //     top: lastInline.top,
  //     left: lastInline.left + lastInline.width + padding.left,
  //     scoreMultiplier: 1,
  //     arrow: 'topleft'
  //   })
  //
  //   // Vinstri síðustu
  //   possibilities.push({
  //     top: lastInline.top + lastInline.height / 2 - tooltip.height / 2,
  //     left: lastInline.left - tooltip.width - padding.left,
  //     scoreMultiplier: 1,
  //     arrow: 'right'
  //   })
  // }

  // return possibilities.map(position => {
  //   let score = position.scoreMultiplier
  //
  //   if (
  //     position.top < relative.top || // Top
  //       position.left < relative.left || // Left
  //       position.top + tooltip.height > relative.top + relative.height || // Bottom
  //       position.left + tooltip.width > relative.left + relative.width // Right
  //   ) {
  //     score = 0
  //   }
  //
  //   // Hlutfall Y miðju frá gluggamiðju
  //   const Y_ratio = (position.top + tooltip.height / 2) /
  //       (relative.top + relative.height / 2)
  //
  //   // Hlutfall X miðju frá gluggamiðju
  //   const X_ratio = (position.left + tooltip.width / 2) /
  //       (relative.left + relative.width / 2)
  //
  //   score = score
  //       // Snúa hlutfalli við ef það er meira en 1
  //       * (X_ratio > 1 ? 1 / X_ratio : X_ratio)
  //       // Viljum frekar að það sé fyrir ofan, hlutfallið skekkist því aðeins
  //       * (Y_ratio > 1 ? 1.5 / Y_ratio : Y_ratio)
  //
  //   return {
  //     ...position,
  //     top: position.top - relative.top,
  //     left: position.left - relative.left,
  //     score
  //   }
  // })
  //   .reduce((prev, cur) => { return prev.score > cur.score ? prev : cur }) // Skila vinsælasta gæjanum
}
