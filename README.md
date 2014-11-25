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
```
$ KEY=your-spreadsheet-key node data-importer/index.js
```

#### Start server
```
$ npm start
```

####Project Submits
Rename the file `src/private-config-example.js` to `src/private-config.js` and enter your SMTP credentials in order to use the submit route.


## API

#### Get Preview Data

`post` http://localhost:1337/api/v1/projects

**Default options:**

```json
{
  "filter" : {},
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

