/**
 * Users are logged in at login.ylhyra.is instead of the editor area at ylhyra.is
 */
import { url } from 'App/url'

const run = (async() => {
  if (window.location.host === 'login.ylhyra.is') {
    const user_id = mw.config.get('wgUserId');
    /* Not logged in */
    if (user_id === null) return;

    const token = await GetSessionVerificationToken()
    if (!token) return;

    var form = $(`
      <form action="${url}/api/user" method="post">
        <input type="hidden" name="token" value="${token}"></input>
      </form>
    `);
    $('body').append(form);
    $(form).submit();
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

run()
