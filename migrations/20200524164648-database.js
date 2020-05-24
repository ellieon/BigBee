'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    db.createTable('config', {
        key: {
            type: 'text',
            primaryKey: true
        },
        value: {
            type: 'text',
        }

    }).then(() => {
        db.insert('config', ['key', 'value'], ['spotify_key', 'NULL'])
    })


    return null;
};

exports.down = function (db) {
    db.dropTable('config')
};

exports._meta = {
    "version": 1
};
