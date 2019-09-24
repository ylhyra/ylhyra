import { exec } from 'child_process'
import { upload_path } from 'config.js'
import fs from 'fs'
import path from 'path'
import shortid from 'shortid'
import slug from 'slug'

const Project = async (blabla, callback) => {
  const { GIT_DIRECTORY } = process.env
  if (!GIT_DIRECTORY) return;
  const REMOTE = 'git@github.com:egilll/tungumal.git'
  const PROJECT_FOLDER = 'tungumal'

  await new Promise((resolve, reject) => {
    exec(`

      cd ${GIT_DIRECTORY}                                        || { exit 1; }
      if [ ! -d "${PROJECT_FOLDER}" ]; then
        git clone -n ${REMOTE} ${PROJECT_FOLDER}
      fi
      cd ${PROJECT_FOLDER}                                       || { exit 1; }

      if [[ \`git rev-parse --abbrev-ref HEAD\` != "master" ]]
      then
        git checkout origin/master -- '*.md' '*.html'                                      || { exit 1; }
      fi
      git reset --hard                                           || { exit 1; }
      git pull origin master                                     || { exit 1; }

      echo '>> START LIST OF FILES'
      git ls-files '*.md' '*.html'
      echo '>> END LIST OF FILES'

    `, (err, stdout, stderr) => {
      if (err !== null) {
        console.error(err)
        throw err
      } else if (typeof(stderr) !== "string") {
        console.error(stderr)
        throw stderr
      } else {
        // console.error(stdout)
        const match = stdout.match(/>> START LIST OF FILES([\s\S]*)>> END LIST OF FILES/)
        // const listOfFiles = match[1]
        console.error(match)
        resolve()
      }
    })
  })
  // callback()
}

// Project()

export default Project
