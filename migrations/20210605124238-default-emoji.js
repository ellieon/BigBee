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
  db.runSql(`insert into config VALUES ('triggers', '["🥺","👉👈","👉 👈",">.<",">_<","😤","😡","😠","≥.≤",":amybrat:"]')`)
  return null;
};

exports.down = function(db) {
  db.runSql(`delete from config where key='triggers'`)
  return null;
};

exports._meta = {
  "version": 1
};