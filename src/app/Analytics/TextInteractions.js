/*
  Analytics on which terms are most clicked on.
*/
// const TESTING = true;
import axios from 'app/App/axios'
// axios.defaults.withCredentials = true;
import { url } from 'app/App/url'
let mode = 'mouse';
let currentId = null;
let startTime = null;
let seen = []
let timer = null;
const reset = () => {
  close()
}
const show = ({ type, id }) => {
  close()
  currentId = id
  startTime = (new Date()).getTime()
}
const close = () => {
  // if(mw.config.get('wgUserGroups').includes('sysop') || mw.config.get('wgUserGroups').includes('editor')) return;
  if (!currentId) return;
  const endTime = (new Date()).getTime()
  const timeDiff = endTime - startTime
  if (timeDiff < 1000) return; // Discard if item was only seen for <1 second
  seen.push({
    id: currentId,
    seenAt: startTime,
    timeSeen: Math.round(timeDiff/100)*100,
  })
  currentId = null
  startTime = null
  timer && clearTimeout(timer)
  timer = setTimeout(send, 5 * 1000)
}
const setTouchMode = () => {
  mode = 'touch'
}
const send = () => {
  if(window.developmentMode) return;
  // axios.post(`${url}/api/a`, {
  //   pageName: mw.config.get('wgPageName'),
  //   seen,
  //   mode,
  // })
  seen = []
}
export default {
  reset,
  show,
  close,
  setTouchMode,
}
