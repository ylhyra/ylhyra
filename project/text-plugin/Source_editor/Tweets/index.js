// id = "844721596359159811"
//
//
// https://api.twitter.com/1.1/statuses/show/844721596359159811

// const host = process.env.NODE_ENV === 'production' ? location.host : 'localhost:8000'
import { send } from 'Editor/web-socket'
import hash from 'project/text-plugin/App/functions/hash'

window.getTweet = (id) => {
  send({ type: 'TWEET', id, })
}

const Tweet = (tweet) => {
  console.log(tweet)
  tweet = {
    ...tweet,
    photos: tweet.photos.map(url => UploadTwitterImage(tweet, url)),
    user: {
      ...tweet.user,
      picture: UploadTwitterImage(tweet, tweet.user.picture)
    }
  }
  console.log(`
    {{tweet
      |text=${tweet.tweet}
      ${tweet.photos.map((photo,index)=>`|photo${index+1}=${photo}`).join('\n')}
      |id=${tweet.id}
      |date=${tweet.date}
      |favorites=${tweet.favorites||''}
      |user_name=${tweet.user.name||''}
      |handle=${tweet.user.handle||''}
      |user_picture=${tweet.user.picture||''}
      |verified=${tweet.user.verified||''}
    }}
  `.replace(/\n +/g, '\n'))
}
export default Tweet

const UploadTwitterImage = (tweet, url) => {
  if(!url) return '';
  var api = new mw.Api();
  const filename = `Tweet-${tweet.user.handle}-${hash(url)}.jpg`
  api.postWithToken('csrf', {
    filename,
    text: `© '''${tweet.user.handle}''' – ${url}`,
    url: url,
    action: 'upload',
    ignorewarnings: '1',
    format: 'json'
  }).done(function(data) {
    console.log(data);
  }).fail(function(data) {
    console.error(data)
  })
  return filename
}




// getTweet('844721596359159811')
// /api/tweets/844721596359159811
