const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

exports.mongoConnect = (cb) => {
  MongoClient.connect(
    'mongodb+srv://root:mongodb@123@cluster0.dbhbj.mongodb.net/shop?retryWrites=true&w=majority'
  )
    .then((client) => {
      console.log('Connected to Mongo DB');
      _db = client.db();
      cb();
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Connection found!!';
};
