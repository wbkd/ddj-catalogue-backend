##DDJ Catalogue Backend

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
$ KEY=your-spreadsheet-key node src/spreadsheet-importer.js
```

#### Start server
```
$ npm start
```

## API

#### Return all objects

`get` http://localhost:1337/api/v1/projects

#### Filtered result

`post` http://localhost:1337/api/v1/projects

**Examples:**

Sort by date and filter visualform=Chart:
```
{ "filters" : { "visualform" : "Chart" }, "sortby" : { "date" : -1 }  }
```

Sort by publisher and get the first 25 items:
```
{ "sortby" : { "publisher" : 1 }, items : 25, offset : 0  }
```

Filter category=Politik and get the second 25 items:
```
{ "filters" : { "category" : "Politik" }, items : 25, offset :1  }
```

