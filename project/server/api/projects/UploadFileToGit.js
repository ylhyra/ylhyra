import { exec } from 'child_process'
import { upload_path } from 'config.js'
import fs from 'fs'
import path from 'path'
import shortid from 'shortid'
import slug from 'slug'

/*
 */
const UploadFileToGit = async ({ metadata, compiled }, callback) => {
  const { GIT_DIRECTORY } = process.env
  if (!GIT_DIRECTORY) return;
  const REMOTE = 'git@github.com:egilll/tungumal.git'
  const PROJECT_FOLDER = 'tungumal'
  const FILENAME = slug(metadata.title || 'file').toLowerCase() + '.html'
  const TEMP_LOCATION = path.resolve(upload_path, `tmp_${shortid.generate()}_${FILENAME}`)

  await new Promise((resolve, reject) => {
    fs.writeFile(TEMP_LOCATION, compiled, (err) => {
      if (err) throw err;
      resolve()
    })
  })

  await new Promise((resolve, reject) => {
    exec(`

      cd ${GIT_DIRECTORY}                                           || { exit 1; }
      if [ ! -d "${PROJECT_FOLDER}" ]; then
        git clone -n ${REMOTE} ${PROJECT_FOLDER}
      fi
      cd ${PROJECT_FOLDER}                                          || { exit 1; }

      if [ ! \`git branch --list gh-pages \`]
      then
         git checkout --orphan gh-pages                             || { exit 1; }
         git reset --hard                                           || { exit 1; }
      else
        if [[ \`git rev-parse --abbrev-ref HEAD\` != "gh-pages" ]]
        then
          git checkout gh-pages                                     || { exit 1; }
        fi
        git reset --hard                                            || { exit 1; }
        git pull origin gh-pages                                    || { exit 1; }
      fi

      mkdir -p compiled                                             || { exit 1; }
      rm compiled/${FILENAME}
      mv ${TEMP_LOCATION} compiled/${FILENAME}                      || { exit 1; }
      git add .
      git commit -m "HTML compiled for \\"${FILENAME}\\""
      git push origin gh-pages                                      || { exit 1; }

    `, (err, stdout, stderr) => {
      if (err !== null) {
        console.error(err)
        throw err
      } else if (typeof(stderr) !== "string") {
        console.error(stderr)
        throw stderr
      } else {
        resolve()
      }
    })
  })
  callback()
}

export default UploadFileToGit











// echo pwd;
// exit;
// cd ${GIT_DIRECTORY}                                   || { exit 1; }
// if [ ! -d "${PROJECT_FOLDER}" ]; then
//   git clone -n ${REMOTE} ${PROJECT_FOLDER}
// fi
//
// cd ${PROJECT_FOLDER}                                  || { exit 1; }
//
// if [ ! \`git branch --list gh-pages \`]
// then
//    git checkout --orphan gh-pages                     || { exit 1; }
//    git reset --hard                                   || { exit 1; }
// else
//   git checkout gh-pages                               || { exit 1; }
//   git pull                                            || { exit 1; }
// fi
//
// mkdir -p compiled                                     || { exit 1; }
// rm compiled/${FILENAME}                               || { exit 1; }
// mv ${TEMP_LOCATION} compiled/${FILENAME}              || { exit 1; }
// git add .
// git commit -m "Added compiled HTML for ${FILENAME}"   || { exit 1; }
// git push origin gh-pages                              || { exit 1; }







/*

# -n will tell git not to checkout the head after performing the clone
git clone -n git@github.com:egilll/tungumal.git
cd tungumal
# git checkout -- "*.xml"

# git symbolic-ref HEAD refs/heads/master
# git branch -d gh-pages # Eyðir "gh-pages"

git checkout --orphan gh-pages
git reset --hard
# git rm --cached -r .                       # rm -r ./*
git add .
git commit -m "haha"
git push origin gh-pages


*/
