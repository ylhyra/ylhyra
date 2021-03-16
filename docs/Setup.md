# Setup

**Install**

```
git clone https://github.com/ylhyra/ylhyra.git \
  --recurse-submodules \
  --remote-submodules
cd ylhyra
npm install
```

**Start**

```
npm start
```

```
npm run server
```

**Open Chrome in un-safe mode**

<!--
This will start a script at `https://localhost:8000/app.js`, a [self-signed](https://en.wikipedia.org/wiki/Self-signed_certificate) script so that it can be loaded from this page, which is HTTPS.

In Chrome, turn on the flag `chrome://flags/#allow-insecure-localhost` and restart Chrome. This will alow self-signed scripts on localhost.
-->
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security --ignore-certificate-errors

**Set the website to development mode**

* Open the console on this site and write: `ylhyraDevelopment(true)`. This will set a cookie that makes the site load the local script.

* To turn off server side rendering, write: `serverSideRendering(false)`.

**MediaWiki on localhost**

You can either develop using a live MediaWiki instance, or use Docker to run MediaWiki as localhost.

```
docker-compose build
docker-compose up -d
```


----

To update git submodules:
> git submodule update --recursive --remote
