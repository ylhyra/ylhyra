/*  _____                _
   |_   _|__  _   _  ___| |__
     | |/ _ \| | | |/ __| '_ \
     | | (_) | |_| | (__| | | |
     |_|\___/ \__,_|\___|_| |_| */

import showWord from 'User/Render/Text/actions/ShowWord'
import ResetTooltips from 'User/Render/Text/actions/Reset'
import { highlightSentence } from 'User/Render/Text/actions/HighlightSentence'
import { showSentence } from 'User/Render/Text/actions/ShowSentence'
import { turnOffDemonstration } from 'User/Render/Frontpage/demo'

let startClickTime = null
let lastClickTime = null
let lastMoveTime = null
let startLocation = null
let lastKnownLocation = null
let detectScrollTimer = null
let lastEvent = null
let lastId = null
let isShowingSomething = false

const reset = () => {
  lastId = null
  isShowingSomething = false
  ResetTooltips()
}

export const TouchEventListenerOn = () => {
  document.addEventListener('touchstart', touchstart, { passive: false })
  document.addEventListener('touchend', touchend, { passive: false })
  document.addEventListener('touchcancel', touchend, { passive: false })
  document.addEventListener('touchmove', touchmove, { passive: false })
}

export const TouchEventListenerOff = () => {
  document.removeEventListener('touchstart', touchstart, { passive: false })
  document.removeEventListener('touchend', touchend, { passive: false })
  document.removeEventListener('touchcancel', touchend, { passive: false })
  document.removeEventListener('touchmove', touchmove, { passive: false })
}


/*
  TOUCH START
*/
const touchstart = (e) => {
  if(!window.listenerCount)return;

  lastEvent = e
  startClickTime = time()
  startLocation = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  }
  FindElements(e)
  detectScrollTimer = setTimeout(() => {
    detectScrollTimer = null
    /*
      If user has been holding finger in, we prevent
      scrolling and allow him to drag over words.
    */
    e.cancelable && e.preventDefault()
  }, 300)
}

/*
  TOUCH MOVE
*/
const touchmove = (e) => {
  if(!window.listenerCount)return;
  lastEvent = e
  lastKnownLocation = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  }

  /* User is scrolling */
  if ((detectScrollTimer && (
      Math.abs(lastKnownLocation.x - startLocation.x) > 100 * window.devicePixelRatio ||
      Math.abs(lastKnownLocation.y - startLocation.y) > 100 * window.devicePixelRatio
    ))) {
    clearTimeout(detectScrollTimer)
    return
  }

  FindElements(e, null, true)
}

/*
  TOUCH END
*/
const touchend = (e) => {
  /*
    User has been dragging finger around.
    Allow tooltip to remain.
  */
  if ((time() - startClickTime > 800) && lastKnownLocation !== null) {
    return
  }

  if (!lastKnownLocation) {
    lastKnownLocation = startLocation
  }
}

/*
  Find element from position.
  Show words or sentences.
*/
const FindElements = (e, doubleClick = false, moving = false) => {
  const touches = e.touches
  const fingers = touches.length
  let x, y
  let kind = 'word'
  if (fingers === 1) {
    x = touches[0].clientX
    y = touches[0].clientY
    kind = 'word'
  } else if (fingers === 2) {
    x = Math.round((touches[0].clientX + touches[1].clientX) / 2)
    y = Math.round((touches[0].clientY + touches[1].clientY) / 2)
    kind = 'sentence'
  } else {
    return reset()
  }
  
  if(!x || !y) return; /* Prevents "The provided double value is non-finite" */


  const target = document.elementFromPoint(x, y)
  // console.log({x,y})
  if (!target) {
    return reset()
  }
  const ignore = target.closest('[data-ignore]')
  if (ignore) return;
  let element = target.closest(`[data-${kind}-has-definition]`)
  if (!element) {
    kind = 'word'
    // console.log('Finding closest')
    element = findClosestElement(x, y) // Find elements in a 20 pixel radius (TODO Needs optimizing)
  }
  if (!element) {
    return reset()
  }
  const id = element.getAttribute('id')

  if (id !== lastId) {
    if (kind === 'word') {
      reset()
      showWord(id)
      const sentence = element.closest(`[data-sentence-has-definition]`)
      if (sentence) {
        const sentenceId = sentence.getAttribute('id')
        highlightSentence(sentenceId)
      }
    } else {
      reset()
      showSentence(id)
    }
    isShowingSomething = kind
    lastId = id
    turnOffDemonstration()
  } else if (isShowingSomething === 'word' && !moving) {
    const sentence = element.closest(`[data-sentence-has-definition]`)
    if (!sentence) { return reset() }
    const sentenceId = sentence.getAttribute('id')
    reset()
    isShowingSomething = true
    showSentence(sentenceId)
    lastId = id
  } else if (isShowingSomething && !moving) {
    reset()
  }
}


const time = () => {
  return (new Date()).getTime()
}


/*
  No overlapping element; find closest element.
  TODO: Optimize!!! Save last results and reset on scroll!
*/
const limit = 20 // Minimum pixel distance
const findClosestElement = (x, y) => {
  const els = document.querySelectorAll(`[data-word-has-definition]`)
  let distances = []
  els.forEach(el => {
    const rects = Array.from(el.getClientRects())
    rects.forEach(rect => {
      const distance_x = (x < rect.x) ? (rect.x - x) : Math.max(0, x - (rect.x + rect.width))
      const distance_y = (y < rect.y) ? (rect.y - y) : Math.max(0, y - (rect.y + rect.height))
      if (distance_x > limit || distance_y > limit) return;
      const distance = Math.sqrt(distance_x ** 2 + distance_y ** 2)
      if(distance > limit) return;
      // console.log({ rect, /*x, y,*/ distance_x, distance_y, distance, el })
      distances.push({ distance, el })
    })
  })
  distances.sort((a, b) => a.distance - b.distance)
  // console.log(distances[0]?.el)
  return distances[0]?.el
}
