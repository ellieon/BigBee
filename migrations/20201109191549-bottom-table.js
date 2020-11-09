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
  db.createTable('bottom', {
    server_id: {
      type: 'text',
      primaryKey: true
    },
    triggers: {
      type: 'JSONB',
    },
    score: {
      type: 'JSONB'
    },
    expires: {
      type: 'text'
    }})

  return null;
};

exports.down = function(db) {
  db.dropTable('spotify_connections')
};

exports._meta = {
  "version": 1
};
