var webDB = {};
webDB.sqlResult = null;

webDB.verbose = function (verbose) {
  var msg;
  if (verbose) {
    html5sql.logInfo = true;
    html5sql.logErrors = true;
    html5sql.putSelectResultsInArray = true;
    msg = 'html5sql verbosity on';
  } else {
    html5sql.logInfo = false;
    html5sql.logErrors = false;
    html5sql.putSelectResultsInArray = false;
    msg = 'html5sql verbosity off';
  }
  console.log(msg);
};

webDB.init = function() {
  // Open and init DB
  try {
    if (openDatabase) {
      webDB.verbose(true);
      webDB.connect('blogDB', 'Blog Database', 5*1024*1024);
      webDB.setupTables();
    } else {
      console.log('Web Databases not supported.');
    }
  } catch (e) {
    console.error('Error occured during DB init. Web Database may not be supported.');
  }
};

webDB.connect = function (database, title, size) {
  html5sql.openDatabase(database, title, size);
  console.log('ran webDB.connect');
};

webDB.setupTables = function () {
  html5sql.process(
    'CREATE TABLE IF NOT EXISTS articles (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, authorUrl VARCHAR (255), category VARCHAR(20), publishedOn DATETIME, body BLOB);',
    function() {
      // on success
      console.log('Success setting up tables.');
    },
    function (error) {
      console.log('Error '+error.message);
    }
  );
};

webDB.execute = function (sql, callback) {
  callback = callback || function() {};
  html5sql.process(
    sql,
    function (tx, result, resultArray) {
      array = resultArray;
      callback(resultArray);
    },
    function (error){
      console.log(error.message);
    }
  );
};

webDB.insertRecord = function (article) {
  // insert article record into database
  html5sql.process(
    [
      {
        'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, body) VALUES (?, ?, ?, ?, ?, ?);',
        'data': [article.title, article.author, article.authorUrl, article.category, article.publishedOn, article.body],
      }
    ],
    function () {
      console.log('Success inserting record for ' + article.title);
    }
  );
};
