# Project setup

## Clone and install

```
git clone --single-branch git@github.com:ylhyra/ylhyra.git --depth=1 && 
git clone --single-branch --branch content git@github.com:ylhyra/ylhyra_content.git --depth=1 && 
cd ylhyra && 
npm i && 
npm run build_all
```

## Set up MySQL

There is no setup script for the MySQL database, you have to copy the contents of src/ylhyra/server/database/ylhyra.sql into your MySQL console.

Then add to your .env file: 

```
YLHYRA_DATABASE_USER=example_user
YLHYRA_DATABASE_PASSWORD=example_password
```

## Run

Then run (each in their own Terminal/Console tab):

```
npm run start
npm run server
```

# Notes

* Turn on the [Prettier](https://prettier.io/) formatter in VSCode.

**Notes regarding server setup**

* Remember to set up a [swapfile](https://www.vultr.com/docs/setup-swap-file-on-linux) on the server so that React builds don't run out of memory
