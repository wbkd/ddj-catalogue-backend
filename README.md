##DDJ Catalogue Backend
Backend of https://github.com/wbkd/ddj-catalogue

#### Installation
```
$ npm install
```

#### Setup MongoDB
You need a running mongo instance
```
$ mongod --dbpath=/your/dbpath
```

#### Import Spreadsheet
Rename the file `src/private-config-example.js` to `src/private-config.js` and enter your spreadsheet api key.
Then you can import the data with:
```
$ node data-importer/index.js
```

If you don't want to update the social counts, do:

```
$ node data-importer/index.js --nosocial
```

#### Start server
```
$ npm start
```

#### Project Submits
Rename the file `src/private-config-example.js` to `src/private-config.js` and enter your SMTP credentials in order to use the submit route.

#### Mailchimp Support
If you want to use automated mailchimp subscription set `useMailchimp:true` in `src/config.js` and add your apikey and the ID of the mailchimp-list to your private config file (`src/private-config.js`). You can find the mailchimp related code under `src/helper/mailchimp.js`.

## API

#### Get Preview Data

`post` http://localhost:1337/api/v1/projects

**Default options:**

```json
{
  "filters" : {},
  "sortby": { "date" : -1 }, 
  "items" : 25, 
  "offset" : 0
}
```

**Examples:**

Sort by date and filter visualform=Chart:
```json
{ 
  "filters" : { "visualform" : "Chart" }, 
  "sortby" : { "date" : -1 }  
}
```

Sort by publisher and get the first 25 items:
```json
{ 
  "sortby" : { "publisher" : 1 }, 
  "items" : 25, 
  "offset" : 0  
}
```

Filter category=Politik and get the second 25 items:
```json
{ 
  "filters": { "category" : "Politik" }, 
  "items": 25, 
  "offset": 1  
}
```

