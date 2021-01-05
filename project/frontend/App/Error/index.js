// import store from 'App/store'

export default function(message, type = 'error', autoHide = false) {
  console.error(message)
  mw.notify($('<span data-nosnippet=true>'+message+'</span>'), { type, autoHide });
}
