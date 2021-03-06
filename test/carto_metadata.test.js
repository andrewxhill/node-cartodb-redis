var redis_config = require('./support/config').redis_pool;

var _           = require('underscore')
    , MetaData  = require('../lib/carto_metadata')(redis_config)
    , Step      = require('step')
    , assert    = require('assert')
;

suite('metadata', function() {

// NOTE: deprecated in 0.2.0
test('test can retrieve database name from header and redis', function(done){
    var req = {headers: {host: 'vizzuality.cartodb.com'}};
    
    MetaData.getDatabase(req, function(err, data){
        assert.equal(data, 'cartodb_test_user_1_db');
        done();
    });
});

test('can retrieve database name for username', function(done){
    MetaData.getUserDBName('vizzuality', function(err, data){
        assert.equal(data, 'cartodb_test_user_1_db');
        done();
    });
});

// NOTE: deprecated in 0.2.0
test('test can retrieve database host from header and redis', function(done){
    var req = {headers: {host: 'vizzuality.cartodb.com'}};
    
    MetaData.getDatabaseHost(req, function(err, data){
        assert.equal(data, 'localhost');
        done();
    });
});


test('can retrieve database host for username', function(done){
    MetaData.getUserDBHost('vizzuality', function(err, data){
        assert.equal(data, 'localhost');
        done();
    });
});

test('can retrieve database password for username', function(done){
    MetaData.getUserDBPass('vizzuality', function(err, data){
        assert.equal(data, 'secret');
        done();
    });
});

// NOTE: deprecated in 0.2.0
test('test can retrieve id from header and redis', function(done){
    var req = {headers: {host: 'vizzuality.cartodb.com'}};

    MetaData.getId(req, function(err, data){
        assert.equal(data, '1');
        done();
    });
});

test('retrieve id for username', function(done){
    MetaData.getUserId('vizzuality', function(err, data){
        assert.equal(data, '1');
        done();
    });
});

test('can retrieve table privacy', function(done){
    var req = {headers: {host: 'vizzuality.cartodb.com'}};
    Step (
      function getPrivate() {
        MetaData.getTablePrivacy('cartodb_test_user_1_db', 'private', this);
      },
      function getPublic(err, data){
        assert.ok(!err, err);
        assert.equal(data, '0'); // private has privacy=0
        MetaData.getTablePrivacy('cartodb_test_user_1_db', 'public', this);
      },
      function check(err, data){
        assert.ok(!err, err);
        assert.equal(data, '1'); // public has privacy=1
        return null;
      },
      function finish(err) {
        done(err);
      }
    );
});

// NOTE: deprecated in 0.2.0
test('can retrieve table geometry type from request header and params', function(done){
    var req = {headers: {host: 'vizzuality.cartodb.com'}, params: {} };
    Step (
      function getPrivate() {
        req.params.table = 'private';
        MetaData.getGeometryType(req, this);
      },
      function getPublic(err, data){
        if ( err ) throw err;
        req.params.table = 'public';
        assert.equal(data, 'point'); 
        MetaData.getGeometryType(req, this);
      },
      function check(err, data){
        if ( err ) throw err;
        assert.equal(data, 'geometry'); 
        return null;
      },
      function finish(err) {
        done(err);
      }
    );
});

test('can retrieve table geometry type from username and tablename', function(done){
    var req = {headers: {host: 'vizzuality.cartodb.com'}};
    Step (
      function getPrivate() {
        MetaData.getTableGeometryType('cartodb_test_user_1_db', 'private', this);
      },
      function getPublic(err, data){
        if ( err ) throw err;
        assert.equal(data, 'point'); 
        MetaData.getTableGeometryType('cartodb_test_user_1_db', 'public', this);
      },
      function check(err, data){
        if ( err ) throw err;
        assert.equal(data, 'geometry'); 
        return null;
      },
      function finish(err) {
        done(err);
      }
    );
});

test('can retrieve map key', function(done){
    MetaData.getUserMapKey('vizzuality', function(err, data){
        assert.equal(data, '1234');
        done();
    });
});

});
