import TouchListener from 'Text/Touch/Touch'
import MouseListener from 'Text/Touch/Mouse'
import Analytics from 'text-plugin/Analytics/TextInteractions'

try {
  window.listenerCount = 1
  const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
  if (supportsTouch) {
    TouchListener()
    Analytics.setTouchMode()
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList && document.body.classList.add('supports-touch')
    })
  } else {
    MouseListener()
  }

} catch (e) {
  console.error(e)
}
