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
  db.createTable('scoreboard', {
    user_id: {
      type: 'text',
      primaryKey: true
    },
    count: {
      type: 'int'
    }})

  return null;
};

exports.down = function(db) {
  db.dropTable('scoreboard')
  return null;
};

exports._meta = {
  "version": 1
};
