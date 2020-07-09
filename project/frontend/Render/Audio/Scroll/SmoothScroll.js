import { getScrollingElement } from 'frontend/Render/helpers.js'

let allowed = true
let temporaryStop

/*
  Scrolls to position, but only if the
  user hasn't recently been scrolling himself
*/
const SmoothScroll = {
  scroll: (change, isHidden) => {
    if (!isHidden) return;
    if (!allowed) return;
    getScrollingElement().scrollBy({
      top: change,
      behavior: 'smooth'
    })
  },
  allow: () => {
    allowed = true
    temporaryStop && clearTimeout(temporaryStop)
  },
  stop: () => {
    allowed = false
    temporaryStop && clearTimeout(temporaryStop)
    temporaryStop = setTimeout(() => {
      allowed = true
    }, 3 * 1000)
  },
}

/*
  Listen for user's scroll.
  We don't want to interrupt it and so stop
  all auto-scrolling for a few seconds afterwards.
*/
typeof window !== 'undefined' && window.addEventListener('mousewheel', () => SmoothScroll.stop(), false)

export default SmoothScroll






/**********************************
  Safari does not have built in smooth scrolling.
  This was an attempt at supporting it,
  but didn't always work.
  (Sometimes the timer became very very slow for some reason)
***********************************/
// let allowed = true
// let timer
// let temporaryStop
// let lastGoal = null
//
// window.addEventListener('mousewheel', () => { SmoothScroll.stop() }, false)
//
// const SmoothScroll = {
//   scroll: (change, isHidden) => {
//     console.warn('FIRED')
//     if (!isHidden) return;
//     if (!allowed) return;
//
//     let start = getScrollingElement().scrollTop
//     let currentTime = 0
//     let increment = 20
//     let duration = 500
//     let goal = start + change
//
//     if (Math.abs(change) < 10) return;
//     if (Math.abs(lastGoal - goal) < 100) return;
//     console.error({goal, lastGoal})
//
//     /*
//       Note:
//       All browsers except Safari support "scrollBy({behaviour:'smooth'})".
//       Therefore we write our own smooth scroll.
//     */
//     const animateScroll = () => {
//       if (!allowed) return;
//       currentTime += increment
//       // var delta = Math.easeInOutQuad(currentTime, 0, change, duration)
//       var delta = currentTime / duration * change
//
//       console.log({currentTime, duration, change, delta: delta.toFixed(0)})
//       getScrollingElement().scrollTop = start + delta
//       if (currentTime < duration) {
//         timer && clearTimeout(timer)
//         timer = setTimeout(animateScroll, increment)
//       } else {
//         lastGoal = null
//       }
//     }
//     animateScroll()
//     lastGoal = goal
//   },
//
//   allow: () => {
//     allowed = true
//     temporaryStop && clearTimeout(temporaryStop)
//   },
//
//   stop: () => {
//     // allowed = false
//     // timer && clearTimeout(timer)
//     // temporaryStop && clearTimeout(temporaryStop)
//     // temporaryStop = setTimeout(() => {
//     //   allowed = true
//     // }, 3 * 1000)
//   },
// }
//
// export default SmoothScroll
//
//
// /*
//   t = current time
//   b = start value
//   c = end value
//   d = duration
// */
// Math.easeInOutQuad = function(t, b, c, d) {
//   t /= d / 2;
//   if (t < 1) return c / 2 * t * t + b;
//   t--;
//   return -c / 2 * (t * (t - 2) - 1) + b;
// }
