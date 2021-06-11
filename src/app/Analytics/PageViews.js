/*
  Tracks time spent on page
*/
import axios from 'app/App/axios'
// axios.defaults.withCredentials = true;

import TextAnalytics from 'app/Analytics/TextInteractions'

require('./Element')

// window.onbeforeunload = function(event) {
//   send()
// };

const send = () => {
  if (mw.config.get('wgUserGroups').includes('sysop') || mw.config.get('wgUserGroups').includes('editor')) return;
  if(window.developmentMode) return;
  axios.post(`/api/a`, {
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
