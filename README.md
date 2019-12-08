# Currency exchange app

This is an abstract app which implements currency exchange functionality. You have a few pockets with different currencies and you can exchange one to another. Stack includes pReact, Redux, Typescript.

## How to install
```
    npm ci
```
## How to build for production
```
    npm run build
```
This comand will makes obfuscated assets for static server in dist directory.

## How to build for dev
```
    npm run watch
```
This comand starts local server on 10001 port with **not obfuscated** source code and this server rebuilds source on every change

## How to build for dev and uglify
```
    npm run watch:build
```

This comand starts local server on 10001 port with **obfuscated** source code and this server rebuilds source on every change

## How to run tests
```
    npm run test
```
This command runs local server on 8080 port and runs puppeteer tests on it and extits after run

## How to run tests in watch mode
```
    npm run wath:test
```
This command runs local server in watch on 8080 port and runs puppeteer tests on it and watches for next changes to rerun this tests