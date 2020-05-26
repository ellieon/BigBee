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
  db.createTable('spotify_connections', {
    user_id: {
      type: 'text',
      primaryKey: true
    },
    connection_token: {
      type: 'text',
    },
    refresh_token: {
      type: 'text'
    },
    expires: {
      type: 'text'
    }}).then(() => {
    db.insert('spotify_connections', ['user_id'], ['1'])
  })


  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
