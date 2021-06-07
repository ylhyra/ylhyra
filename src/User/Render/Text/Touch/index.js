import { TouchEventListenerOn, TouchEventListenerOff } from 'User/Render/Text/Touch/Touch'
import { MouseEventListenerOn, MouseEventListenerOff } from 'User/Render/Text/Touch/Mouse'
import Analytics from 'User/Analytics/TextInteractions'
import { isBrowser, supportsTouch } from 'User/App/functions/isBrowser'

export const TextEventListenersOn = () => {
  try {
    window.listenerCount = 1
    if (supportsTouch) {
      TouchEventListenerOn()
      Analytics.setTouchMode()
      document.addEventListener('DOMContentLoaded', () => {
        document.body.classList && document.body.classList.add('supports-touch')
      })
    } else {
      MouseEventListenerOn()
    }
  } catch (e) {
    console.error(e)
  }
}

export const TextEventListenersOff = () => {
  if (supportsTouch) {
    TouchEventListenerOff()
  } else {
    MouseEventListenerOff()
  }
}
