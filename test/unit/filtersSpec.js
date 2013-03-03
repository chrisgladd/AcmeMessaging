'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {

  beforeEach(module('acmeMsg.filters'));
  beforeEach(module('acmeMsg.services'));

  describe('interpolate', function() {

    it('should replace %VERSION% with 0.1',
        inject(function(interpolateFilter) {
            expect(interpolateFilter("App Version: %VERSION%")).toEqual('App Version: 0.1');
        })
    );
  });

});
