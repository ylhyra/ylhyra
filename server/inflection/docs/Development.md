# Development

This repository can be run without setting up a database, with data being fetched from Ylhýra's servers.

**Setup**

> git clone https://github.com/ylhyra/icelandic-inflections.git
> cd icelandic-inflections
> npm i nodemon --global
> npm i

**Run**

> npm start

This starts a local server with the same URL structure as the normal API.

http://localhost:4545/api/inflection?search=fara

http://localhost:4545/api/inflection?search=fara&type=html





**Running with a database**

Currently, to run with a full database of the BÍN data, this repository has to be kept as a sub-module of [Ylhýra](https://github.com/ylhyra/ylhyra).
