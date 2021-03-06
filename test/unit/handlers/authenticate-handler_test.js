
/**
 * Module dependencies.
 */

var AuthenticateHandler = require('../../../lib/handlers/authenticate-handler');
var Request = require('../../../lib/request');
var sinon = require('sinon');
var should = require('should');

/**
 * Test `AuthenticateHandler`.
 */

describe('AuthenticateHandler', function() {
  describe('getTokenFromRequest()', function() {
    describe('with bearer token in the request authorization header', function() {
      it('should call `getTokenFromRequestHeader()`', function() {
        var handler = new AuthenticateHandler({ model: { getAccessToken: function() {} } });
        var request = new Request({
          body: {},
          headers: { 'Authorization': 'Bearer foo' },
          method: {},
          query: {}
        });

        sinon.stub(handler, 'getTokenFromRequestHeader');

        handler.getTokenFromRequest(request);

        handler.getTokenFromRequestHeader.callCount.should.equal(1);
        handler.getTokenFromRequestHeader.firstCall.args[0].should.equal(request);
        handler.getTokenFromRequestHeader.restore();
      });
    });

    describe('with bearer token in the request query', function() {
      it('should call `getTokenFromRequestQuery()`', function() {
        var handler = new AuthenticateHandler({ model: { getAccessToken: function() {} } });
        var request = new Request({
          body: {},
          headers: {},
          method: {},
          query: { access_token: 'foo' }
        });

        sinon.stub(handler, 'getTokenFromRequestQuery');

        handler.getTokenFromRequest(request);

        handler.getTokenFromRequestQuery.callCount.should.equal(1);
        handler.getTokenFromRequestQuery.firstCall.args[0].should.equal(request);
        handler.getTokenFromRequestQuery.restore();
      });
    });

    describe('with bearer token in the request body', function() {
      it('should call `getTokenFromRequestBody()`', function() {
        var handler = new AuthenticateHandler({ model: { getAccessToken: function() {} } });
        var request = new Request({
          body: { access_token: 'foo' },
          headers: {},
          method: {},
          query: {}
        });

        sinon.stub(handler, 'getTokenFromRequestBody');

        handler.getTokenFromRequest(request);

        handler.getTokenFromRequestBody.callCount.should.equal(1);
        handler.getTokenFromRequestBody.firstCall.args[0].should.equal(request);
        handler.getTokenFromRequestBody.restore();
      });
    });
  });

  describe('getAccessToken()', function() {
    it('should call `model.getAccessToken()`', function() {
      var model = {
        getAccessToken: sinon.stub().returns({ user: {} })
      };
      var handler = new AuthenticateHandler({ model: model, context: {e:123} });

      return handler.getAccessToken('foo')
        .then(function() {
          model.getAccessToken.callCount.should.equal(1);
          model.getAccessToken.firstCall.args.should.have.length(2);
          model.getAccessToken.firstCall.args[0].should.equal('foo');
          model.getAccessToken.firstCall.args[1].e.should.equal(123);
        })
        .catch(should.fail);
    });
  });

  describe('validateScope()', function() {
    it('should call `model.getAccessToken()` if scope is defined', function() {
      var model = {
        getAccessToken: function() {},
        validateScope: sinon.stub().returns(true)
      };
      var handler = new AuthenticateHandler({ addAcceptedScopesHeader: true, addAuthorizedScopesHeader: true, model: model, scope: 'bar', context: {e:456} });

      return handler.validateScope('foo')
        .then(function() {
          model.validateScope.callCount.should.equal(1);
          model.validateScope.firstCall.args.should.have.length(3);
          model.validateScope.firstCall.args[0].should.equal('foo', 'bar');
          model.validateScope.firstCall.args[2].e.should.equal(456);
        })
        .catch(should.fail);
    });
  });
});
