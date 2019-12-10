// import store from 'App/store'

export default function(message) {
  console.error(message)
  mw.notify(message, { type: 'error', autoHide: false });
}
