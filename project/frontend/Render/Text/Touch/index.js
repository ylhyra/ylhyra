import { TouchEventListenerOn, TouchEventListenerOff } from 'Render/Text/Touch/Touch'
import { MouseEventListenerOn, MouseEventListenerOff } from 'Render/Text/Touch/Mouse'
import Analytics from 'frontend/Analytics/TextInteractions'
import { isBrowser, supportsTouch } from 'project/frontend/App/functions/isBrowser'

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
