# Setup

**Install**

```
git clone https://github.com/ylhyra/ylhyra.git \
  --recurse-submodules \
  --remote-submodules
cd ylhyra
npm install
npm run database:create
```

**Start**

```
npm start
```

```
npm run server
```

**Configure Chrome to accept self-signed scripts**

In Chrome, turn on the flag `chrome://flags/#allow-insecure-localhost` and restart Chrome. This will alow self-signed scripts on localhost.

**Set the website to development mode**

* Open the console on this site and write: `ylhyraDevelopment(true)`. This will set a cookie that makes the site load the local script. 

* To turn off server side rendering, write: `serverSideRendering('false')`.

**MediaWiki on localhost**

You can either develop using a live MediaWiki instance, or use Docker to run MediaWiki as localhost.

```
docker-compose build
docker-compose up -d
```