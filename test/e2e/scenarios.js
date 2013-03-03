'use strict';

describe('Acme Messaging App', function() {

  describe('Login View', function() {
      beforeEach(function(){
          browser().navigateTo("../../index.html#/login");
      });


      it('should log the user in', function(){
        input('loginEmail').enter('cmg301@gmail.com');
        input('loginPass').enter('blkajdf');

        element('.LoginBtn').click();

        expect(browser().location().url()).toBe('/inbox');
      });
  });

  describe('Inbox View', function() {

    beforeEach(function() {
        browser().navigateTo('../../index.html#/inbox');
    });


    it('should load the all the messages', function() {
      expect(repeater('.HomeInboxUL:eq(0) li').count()).toBe(6);

      expect(repeater('.HomeProcUL li').count()).toBe(4);
    });


    it('should render message specific links', function() {
      element('.HomeInboxUL:eq(0) li:eq(0) a').click();
      expect(browser().location().url()).toBe('/message/0');
    });
  });

  describe('Message detail view', function() {

    beforeEach(function() {
      browser().navigateTo('../../index.html#/message/0');
    });


    it('should display message 0 page', function() {
        expect(element("#MsgForm input:eq(0)").val()).toBe("0");
        expect(element("#MsgForm input:eq(1)").val()).toBe("John Smith");
        expect(element("#MsgForm select:eq(0)").val()).toBe("0");
    });


    it('should be impossible to send the message with bad data', function() {
        input("msg.text").enter("Bad Data");
        element("#MsgForm input[type='submit']:eq(0)").click();

        expect(browser().location().url()).toBe('/message/0');
    });


    it('should be possible to send the message', function() {
        element("#MsgForm input[type='submit']:eq(0)").click();

        expect(browser().location().url()).toBe('/inbox');

        //Now check and make sure the message has been
        //correctly refiled as processed
        expect(repeater('.HomeInboxUL:eq(0) li').count()).toBe(5);

        expect(repeater('.HomeProcUL li').count()).toBe(5);
    });

    it('should be possible to log out', function() {
        element('.UserDiv').click();

        element('#LogoutBtn').click();

        expect(browser().location().url()).toBe('/login');
    });


  });

});
