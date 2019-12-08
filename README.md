# Currency exchange app

This is some abstract app which implement currency exchange functionality. You have some pockets whith money and you can change balanse this pockets by exchanging it to other. You can use any dirrection.
Stack pReact, Redux, Typescript.

## How to install
```
    npm ci
```
## How to build for production
```
    npm run build
```
This comand will make obfuscated assets for static server in dist directory.

## How to build for dev
```
    npm run watch
```
This comand starts local server on 10001 port with **not obfuscated** source code and this server will rebuild source on every change

## How to build for dev and uglify
```
    npm run watch:build
```

This comand starts local server on 10001 port with **obfuscated** source code and this server will rebuild source on every change

## How to run tests
```
    npm run test
```
This command run local server on 8080 port and run puppeteer tests on it and extit after run

## How to run tests in watch mode
```
    npm run wath:test
```
This command run local server in watch on 8080 port and run puppeteer tests on it and will watch for next changes for rerun this tests