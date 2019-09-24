/*
  Ókei, þetta virkar ekki nema maður borgi fyrir GoogleAPI
*/

import request from 'request'

const GoogleTranslateAPI = (req, res) => {
  const {
    sourceText,
    sourceLang,
    targetLang
  } = req.body

  var headers = {
    'origin': 'https://elpais.com',
    // 'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,is;q=0.8,da;q=0.7,es;q=0.6,sv;q=0.5',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded',
    'accept': '*/*',
    'referer': 'https://elpais.com/',
    'authority': 'translate.googleapis.com',
    'x-client-data': 'CJK2yQEIpLbJAQjEtskBCKmdygEIqKPKARiSo8oB',
    'dnt': '1',
  };

  var dataString = `q=Ver%20todas%20las%20noticias%20de%20I%C3%B1igo%20Dom%C3%ADnguez`

  var options = {
    url: 'https://translate.googleapis.com/translate_a/t?anno=3&client=tee&format=html&v=1.0&key&logld=vTE_20170911_00&sl=auto&tl=en&sp=nmt&tc=3&sr=1&tk=63116.426186&mode=1',
    method: 'POST',
    headers: headers,
    body: dataString
  };

  // console.log('haha')
  // return
  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log(body)
      res.send(body)
    } else {
      console.log(error)
      console.log(response)
      res.send(null)
    }
  })
}

export default GoogleTranslateAPI;



// curl 'https://translate.googleapis.com/translate_a/t?anno=3&client=tee&format=html&v=1.0&key&logld=vTE_20170911_00&sl=auto&tl=en&sp=nmt&tc=3&sr=1&tk=63116.426186&mode=1' -H 'origin: https://elpais.com' -H 'accept-encoding: gzip, deflate, br' -H 'accept-language: en-US,en;q=0.9,is;q=0.8,da;q=0.7,es;q=0.6,sv;q=0.5' -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36' -H 'content-type: application/x-www-form-urlencoded' -H 'accept: */*' -H 'referer: https://elpais.com/' -H 'authority: translate.googleapis.com' -H 'x-client-data: CJK2yQEIpLbJAQjEtskBCKmdygEIqKPKARiSo8oB' -H 'dnt: 1' --data 'q=Ver%20todas%20las%20noticias%20de%20I%C3%B1igo%20Dom%C3%ADnguez&q=Comentarios&q=T%C3%ADtulos%2C%20gesti%C3%B3n%2C%20tribunales...%20La%20Universidad%2C%20cuestionada&q=Luis%20M%C3%A1rquez%2C%20en%202015.&q=Ver%20todas%20las%20noticias%20de%20Oriol%20G%C3%BCell&q=Cifuentes%20junto%20a%20Rajoy%20en%20Alcal%C3%A1%20de%20Henares.&q=Ver%20todas%20las%20noticias%20de%20Jes%C3%BAs%20Ruiz%20Mantilla&q=El%20presidente%20Touad%C3%A9ra%2C%20tras%20votar%20en%202016.&q=Ver%20todas%20las%20noticias%20de%20%C3%93SCAR%20GUTI%C3%89RREZ&q=El%20director%20de%20EL%20PA%C3%8DS%20recoge%20el%20galard%C3%B3n.&q=Imagen%20de%20las%20instalaciones%20facilitada%20por%20la%20polic%C3%ADa.&q=Ver%20todas%20las%20noticias%20de%20Pepe%20Seijo&q=Ver%20todas%20las%20noticias%20de%20Silvia%20R.%20Pontevedra&q=Las%20noticias%20falsas%20sobre%20el%20vino%20y%20la%20cerveza%20que%20no%20deber%C3%ADas%20creer&q=Ver%20todas%20las%20noticias%20de%20Juan%20Revenga%20Frauca&q=%C2%BFCu%C3%A1ntas%20familias%20tienen%20hoy%20en%20d%C3%ADa%20tres%20hijos%3F&q=Ver%20todas%20las%20noticias%20de%20H%C3%A9ctor%20Llanos%20Mart%C3%ADnez&q=Ver%20todas%20las%20noticias%20de%20Pablo%20Cant%C3%B3' --compressed
