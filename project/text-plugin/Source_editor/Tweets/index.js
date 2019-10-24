import { send } from 'Editor/web-socket'
import hash from 'project/text-plugin/App/functions/hash'
import { editPage } from 'Editor/actions'
import urlSlug from 'App/functions/url-slug'

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
  const wikicode = `
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
  `.replace(/\n +/g, '\n').trim()

  const doc = `
    {{start|{{subst:FULLPAGENAME}}}}
    ${wikicode}
    {{end}}<noinclude>
    [[Category:Tweets]]
    [[Category:${tweet.user.handle}]]
    </noinclude>
  `.replace(/\n +/g, '\n').trim()

  editPage({
    title: `${tweet.user.handle}/${tweet.tweet.replace(/[\n"]/g,'').match(/(.{0,33})[^ ]+/)[0].trim()}`,
    text: doc,
    summary: '+',
  })
}
export default Tweet

const UploadTwitterImage = (tweet, url) => {
  if (!url) return '';
  // return;
  var api = new mw.Api()
  const filename = `Tweet-${tweet.user.handle}-${hash(url)}${url.match(/\.([^.]+)$/)[0]}`
  api.postWithToken('csrf', {
    filename,
    text: `© '''${tweet.user.handle}''' – ${url}`,
    url: url,
    action: 'upload',
    ignorewarnings: '1',
    format: 'json'
  }).done(function(data) {
    console.log(data);
  }).fail(function(error) {
    if(error ==='fileexists-no-change') return;
    console.error(error)
  })
  return filename
}




// getTweet('844721596359159811')
// /api/tweets/844721596359159811

/*
let i = 0
setInterval(()=>{
  getTweet(ids[i++])
},7000)
const ids = [
  // "860604707705901060",
  // "766036267436019714",
  // "755469675270668288",
  // "844345564963753984",
  // "844721596359159811",
  // "835842608744235009",
  // "881845876242620416",
  // "823903701332987904",
  // "820406445355204614",
  // "817046004805595136",
  // "848908520393252866",
  // "820424439523373057",
  // "755156797372108800",
  // "805864890518949888",
  // "886750070590386177",
  // "857346862172565506",
  // "872909868767866880",
  // "843510430672871424",
  // "878328992805171200",
  // "769722373633351680",
  // "758349158000500736",
  // "874301765214195712",
  // "866737838284578816",
  // "831139921863778309",
  // "848201156505591808",
  // "871525071776514051",
  // "815595388946251776",
  // "865659310289723392",
  // "810807254823923712",
  // "659789103605653504",
  // "802486242382184448",
  // "637966748457803776",
  // "660387255022940160",
  // "852863156590440448",
  // "695280075785240577",
  // "669446038512603140",
  // "737712613757440000",
  // "692461473277296640",
  // "633372408351715328",
  // "628915610488020992",
  // "635372848429821952",
  // "644660348734337024",
  // "660387447524691968",
  // "814138149882437633",
  // "886641331216449537",
  // "815344952162983936",
  // "790983126994522112",
  // "726001377831452672",
  // "810521098588721152",
  // "868581066302521344",
  // "823969533950119936",
  // "847005505864257536",
  // "851160002006011905",
  // "864818964651802625",
  // "717404017232646144",
  // "850457097137520640",
  // "804790705122115585",
  // "816103157323337728",
  // "805774128531853312",
  // "780456894800523265",
  // "836588432621252609",
  // "841770696355287044",
  // "819907336642985984",
  // "762727075551842304",
  // "805165033152008193",
  // "796086872355340288",
  // "854481702202351616",
  // "821020844025675776",
  // "870229821363761153",
  // "838393731472568320",
  // "762811956881399808",
  // "848165369734979589",
  // "855428479139098624",
  // "800812651035197440",
  // "844884244371509248",
  // "841294633447612417",
  // "830106220111474689",
  // "805520660084695041",
  // "835853515117461504",
  // "863716482966016000",
  // "823625106937278466",
  // "854769946513088513",
  // "795042356835876864",
  // "886337118896869377",
  // "805004760533389312",
  // "831291885759131648",
  // "836956196573700096",
  // "775648142280851456",
  // "881501962423894016",
  // "817152764165914629",
  // "886873577273917441",
  // "817966497326841857",
  // "736194058352230402",
  // "827654120165298177",
  // "753706794082504707",
  // "885817503330553856",
  // "865948753538232320",
  // "770686446307008513",
  // "785580133553930241",
  // "783029128605802496",
  // "806125727024316416",
  // "696350873203638272",
  // "878626327527608320",
  // "826039414048616449",
  // "838444429153304576",
  // "867921940966780930",
  // "832013369611788288",
  // "833395212311470082",
  // "867417078436954112",
  // "881218382078640129",
  // "885208354557218816",
  // "874340460495609856",
  // "843774940147015680",
  // "839796729511804928",

  // Kjamanden er ekki með mynd og fær villu:
  // "838095062517055489",
  // "864839784845455360",
  // "870430737077592064",
  // "804836745699348480",
  // "794722123755515904",
  // "817516665223213056",
  // "790266044409577472",
  // "837250569035198464",
  // "813761698268114944",
  // "794576367820165120",

  "815305440179449856",
  "800393991569231873",
  "813877240362631169",
  "834740333346951168",
  "664156211516973056",
  "824337990583537665",
  "786617454105681928",
  "828996974250754048",
  "832029485616599044",
  "842824465646047232",
  "827196564997337090",
  "832028571455594496",
  "825759661764800512",
  "847473839864926208",
  "829425426644738050",
  "827222810212892672",
  "832753451947827204",
  "829689222206541824",
  "828602207394205696",
  "829274682620784640",
  "827946689679994880",
  "826840183953883136",
  "846086383819218944",
  "831543287605493760",
  "826462411788005377",
]

*/
