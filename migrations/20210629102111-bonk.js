'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.runSql(`insert into config VALUES ('bonk', '["https://media1.tenor.com/images/d9386a331ecabad070b6cf0249467294/tenor.gif", "https://media.tenor.com/images/206285f0f59420c5fbe8b256b0caab71/tenor.gif"]')`)
  return null;
};

exports.down = function(db) {
  db.runSql(`delete from config where key='bonk'`)
  return null;
};

exports._meta = {
  "version": 1
};
