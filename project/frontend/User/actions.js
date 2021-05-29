/**
 * Users are logged in at login.ylhyra.is instead of the editor area at ylhyra.is
 */
import store from 'App/store'
import { url } from 'App/url'
import { setCookie, getCookie } from 'DevelopmentMode/cookies'

export const Initialize = (async() => {
 if (window.location.host === 'login.ylhyra.is') {
   const user_id = mw.config.get('wgUserId');
   /* Not logged in */
   if (user_id === null) return;

   const token = await GetSessionVerificationToken()
   if (!token) return;

   // var form = $(`
   //   <form action="${url}/api/user" method="post">
   //     <input type="hidden" name="token" value="${token}"></input>
   //   </form>
   // `);
   // $('body').append(form);
   // $(form).submit();
   //
   $.post(`${url}/api/user`, { token }, function (data) {
     console.log(data)
     document.cookie = `ylhyra_user=${JSON.stringify(data)}; expires=Sun, 1 Jan 2060 00:00:00 UTC;domain=.ylhyra.is;path=/`
     setCookie('ylhyra_user', JSON.stringify(data), 5 * 365, 'domain=.ylhyra.is;')
     window.location.href = "https://ylhyra.is/User:Egill"; //tmp
   })
   // .fail(function () {
   //   alert("error");
   // })
 } else {
   if (getCookie('ylhyra_user')) {
     const { user, signature } = JSON.parse(getCookie('ylhyra_user'))
     // TODO: verify
     store.dispatch({
       type: 'LOAD_USER',
       content: user,
     })
   }
 }
})

export const GetSessionVerificationToken = () => {
 return new Promise(async resolve => {
   var api = new mw.Api();
   api.get({
     action: 'session_verification',
     format: 'json'
   }).done(function (data) {
     const session_verification_token = data.session_verification.token
     if (!session_verification_token) {
       // error('Server could not verify that you are logged in')
       return console.log(data)
     }
     resolve(session_verification_token)
   });
 })
}
