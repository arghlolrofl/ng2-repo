# Francotyp Postalia - Franking App
The app is fully written with AngularJS 2.
It is basically a UI wrapping app for postal franking.

## Development
The application uses TypeScript with AngularJS 2. It compiles all TypeScript
files on-the-fly to plain JS files. Simply start the dev environment and it
will automatically open your primary browser with hot-reload.

### Installation
Simply install all dependencies with
```
npm install
```
maybe you have to install ruby and scss as well
```
gem install scss
```

### Start (dev environment)
You can start the dev-environment by executing the command
```
npm start
```

### Build SCSS
```
npm run scss
```

## Production use
To build the package in a final version for production system use the command
```
npm run package
```

After you've runned the command you will find a app.zip in the root directory.
This file contains everything you need for production use.