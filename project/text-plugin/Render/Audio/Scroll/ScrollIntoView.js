import SmoothScroll from './SmoothScroll'
const ControlsHeight = 45
import {getScrollingElement} from 'helpers.js'

/*
  Calculates ideal position for element.

  TODO:
  Currently assumes document fills entire window.
  Is okay as long as the window is always the scrollable element,
  but is a rather bad solution.
*/
export default function ScrollIntoView (ids) {
  // if (!ids) return;
  // ids = Array.isArray(ids) ? ids : [ids]
  // ids.forEach(id => {
  //   // const element = document.getElementById(id)
  //   // if (!element) return;
  //   // element.classList.add(cssClass)
  // })
  //
  // const id = ids[ids.length - 1]
  //
  // const element = document.getElementById(id)
  // if (!element) return;
  // const elementRect = element.getBoundingClientRect()
  //
  // // const containerRect = getScrollingElement().getBoundingClientRect()
  // // console.log(containerRect)
  // // const topOfScreenOrContainer = Math.max(0, containerRect.y)
  // // const topOfScreenOrContainerWithControls = topOfScreenOrContainer + ControlsHeight
  // // const bottomOfScreenOrContainer = Math.min(window.innerHeight, topOfScreenOrContainer + containerRect.height)
  // //
  // // const isAbove = topOfScreenOrContainerWithControls >= elementRect.y - 100
  // // const isBelow = bottomOfScreenOrContainer <= elementRect.y + elementRect.height + 100
  // //
  // // let idealPosition = 15 / 100 * (bottomOfScreenOrContainer - topOfScreenOrContainerWithControls)
  // // idealPosition = Math.max(100, idealPosition)
  // // const idealPositionChange = parseInt(elementRect.y - idealPosition)
  // // console.log({isAbove, isBelow})
  //
  // const isAbove = ControlsHeight >= elementRect.y - 100
  // const isBelow = window.innerHeight <= elementRect.y + elementRect.height + 100
  //
  // let idealPosition = 15 / 100 * (window.innerHeight - ControlsHeight)
  // idealPosition = Math.max(100, idealPosition)
  // const idealPositionChange = parseInt(elementRect.y - idealPosition)
  // SmoothScroll.scroll(idealPositionChange, isAbove || isBelow)
}


// function getScrollParent(node) {
//   if (node === null) {
//     return null;
//   }
//   // console.log(node.scrollHeight)
//   if (node.scrollHeight > node.clientHeight) {
//     return node;
//   } else {
//     return getScrollParent(node.parentNode);
//   }
// }
