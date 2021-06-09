var fs = require('fs');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

let folders = {}
let redirects = {}

// fs.rmdirSync(__dirname + '/../../ylhyra_content/output/')
fs.mkdirSync(__dirname + '/../../ylhyra_content/output/')
// fs.mkdirSync(__dirname + '/../../ylhyra_content/output/data/')

const run = () => {
  fs.readFile(__dirname + '/../../ylhyra_content/dump.xml', function (err, data) {
    parser.parseString(data, function (err, result) {
      /* Find redirects */
      result.mediawiki.page.forEach(page => {
        const title = page.title[0].replace(/:/g, '/')
        if(title.match(/([^/]+)$/)){
          folders[title.match(/^(.+)\/([^/]+)$/)][0] = true
        }
        // console.log(JSON.stringify(page, null, 2))
        if (page.redirect) {
          const target = page.redirect[0].$.title
          const full_target = page.revision[0].text[0]._.match(/redirect ?\[\[(.+)\]\]/i)[0]
          if (!(target in redirects)) redirects[target] = [];
          redirects[target].push(`${title} -> ${full_target}`)
        }
      })
      result.mediawiki.page.forEach(page => {
        if (page.redirect) return;
        let title = page.title[0].replace(/:/g, '/')
        if (/^(Game talk|User|User talk|Software|Help|Category)\//.test(title)) return;
        const text = page.revision[0].text[0]._
        // console.log(page)
        // console.log(JSON.stringify(page, null, 2))
        // process.exit()
        let header = `
          title = ${page.title}
          redirects = ${redirects[title] ? redirects[title].join('; ') : ''}
        `

        if (page.ns[0] === '0') {
          if (/\{\{book/.test(text)||
            /(Blær|Brennu-Njáls|Jochum|Hallgríms|Þorstei|Svein|Imb|Españ|Tweets|Villi)/.test(title)
          ) {
            title = 'reading/' + title
          } else {
            title = 'other/' + title
          }
          title = 'content/' + title
        } else {
          title = 'other_namespaces/' + title
        }

        writeFileSyncRecursive(__dirname + `/../../ylhyra_content/output/${title.replace(/ /g, '_')}.md`, header.replace(/\n +/g, '\n').trim() + '\n---\n\n' + text)
      })
    });
  });
}



/*
  Author: drodsou
  https://gist.github.com/drodsou/de2ba6291aea67ffc5bc4b52d8c32abd
*/
function writeFileSyncRecursive(filename, content, charset) {
  // -- normalize path separator to '/' instead of path.sep,
  // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g, '/');

  // -- preparation to allow absolute paths as well
  let root = '';
  if (filepath[0] === '/') {
    root = '/';
    filepath = filepath.slice(1);
  } else if (filepath[1] === ':') {
    root = filepath.slice(0, 3); // c:\
    filepath = filepath.slice(3);
  }

  // -- create folders all the way down
  const folders = filepath.split('/').slice(0, -1); // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = acc + folder + '/';
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      return folderPath
    },
    root // first 'acc', important
  );

  // -- write file
  fs.writeFileSync(root + filepath, content, charset);
}

run()
