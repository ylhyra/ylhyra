require('src/User/App/functions/array-foreach-async')
import { editPage, getNewEditToken } from 'Editor/actions'

const rename = [
]

window.batchRename = () => {
  rename.forEachAsync(async(q) => {
    await new Promise((resolve) => {
      movePage(q[0], q[1], () => {
        movePage('Data:' + q[0], 'Data:' + q[1], () => {

          const api = new mw.Api();
          api.get({
            action: 'query',
            titles: q[1],
            format: 'json',
            prop: 'revisions',
            rvslots: '*',
            rvprop: 'content',
          }).done(data => {
            // console.log(data)
            Object.keys(data.query.pages).forEach(page => {
              let text = data.query.pages[page].revisions[0].slots.main['*']
              text = text.replace(/{{start\|.+?}}/, `{{start|{{subst:FULLPAGENAME}}}}`)
              editPage({
                title: q[1],
                text: text,
                summary: '+',
              })
              console.log(q[0])
            })
            resolve()
          });
        })
      })
    })
  })
}

export const movePage = (from, to, callback) => {
  getNewEditToken(token => {
    $.ajax({
        url: mw.util.wikiScript('api'),
        type: 'POST',
        dataType: 'json',
        data: {
          action: 'move',
          from: from,
          to: to,
          reason: '',
          movetalk: '1',
          noredirect: '0',
          format: 'json',
          token: token // mw.user.tokens.get('editToken')
        }
      })
      .done(function (data) {
        // console.log(data)
        callback()
      })
      .fail(function () {
        console.warn('The ajax request failed.');
        // callback && callback(false)
      })
  })
}

window.movePage = movePage
