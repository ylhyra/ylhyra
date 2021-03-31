/*
  Tracks time spent on page
*/
import axios from 'axios'
// axios.defaults.withCredentials = true;
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''
import TextAnalytics from 'frontend/Analytics/TextInteractions'

require('./Element')

// window.onbeforeunload = function(event) {
//   send()
// };

const send = () => {
  if (mw.config.get('wgUserGroups').includes('sysop') || mw.config.get('wgUserGroups').includes('editor')) return;
  if(window.developmentMode) return;
  axios.post(`${url}/api/a`, {
    pageName: mw.config.get('wgPageName'),
  })
}

setTimeout(() => {
  send()
}, 5000)



window.addEventListener('blur', function() {
  TextAnalytics.close()
});
// window.addEventListener('focus', function() {
// });
