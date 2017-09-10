const _ = require('lodash');
const assert = require('assert');

const Volunter = require('../components/Volunteer/Volunteer');


describe('Volunteer', () => {
  describe('#Constructor', () => {
    it('Should contain all database elements', () => {
      const volunteer = new Volunter();

      assert.equal(_.isUndefined(volunteer.id), false, 'Volunteer class must contain: "id"');
      assert.equal(_.isUndefined(volunteer.username), false, 'Volunteer class must contain: "username"');
      assert.equal(_.isUndefined(volunteer.password), false, 'Volunteer class must contain: "password"');
      assert.equal(_.isUndefined(volunteer.position), false, 'Volunteer class must contain: "position"');
      assert.equal(_.isUndefined(volunteer.volunteerStatus), false, 'Volunteer class must contain: "volunteerStatus"');
      assert.equal(_.isUndefined(volunteer.name), false, 'Volunteer class must contain: "name"');
      assert.equal(_.isUndefined(volunteer.about), false, 'Volunteer class must contain: "about"');
      assert.equal(_.isUndefined(volunteer.phone), false, 'Volunteer class must contain: "phone"');
      assert.equal(_.isUndefined(volunteer.location), false, 'Volunteer class must contain: "location"');
      assert.equal(_.isUndefined(volunteer.timezone), false, 'Volunteer class must contain: "timezone"');
      assert.equal(_.isUndefined(volunteer.linkedInId), false, 'Volunteer class must contain: "linkedInId"');
      assert.equal(_.isUndefined(volunteer.slackId), false, 'Volunteer class must contain: "slackId"');
      assert.equal(_.isUndefined(volunteer.githubId), false, 'Volunteer class must contain: "githubId"');
      assert.equal(_.isUndefined(volunteer.isHatchling), false, 'Volunteer class must contain: "isHatchling"');
      assert.equal(_.isUndefined(volunteer.developerLevel), false, 'Volunteer class must contain: "developerLevel"');
      assert.equal(_.isUndefined(volunteer.adminPortalAccess), false, 'Volunteer class must contain: "adminPortalAccess"');
      assert.equal(_.isUndefined(volunteer.adminOverallLevel), false, 'Volunteer class must contain: "adminOverallLevel"');
      assert.equal(_.isUndefined(volunteer.verified), false, 'Volunteer class must contain: "verified"');
      assert.equal(_.isUndefined(volunteer.email), false, 'Volunteer class must contain: "email"');
      assert.equal(_.isUndefined(volunteer.salt), false, 'Volunteer class must contain: "salt"');
    });
  });

  describe('#compareAuthenticatingPassword', () => {
    it('Should return true if the stored salt and hash match the passed password', () => {
      const volunteer = new Volunter();
      volunteer.salt = '5HomjhDxeSNT4H9JmD3iW7h0iUjLyDG7XnKbvQK+QYxN914GExndCEKI5azGaSNSZKcgPrjyxvO04GO/QN6FtRpaTYbOF3DAVU9U6i+1VfEMWcvOgb7sUmOb/OI48WRiPgcmatDmPMz89Ih0IspYq/Po+/UOnOMCEmDkfrfhlK8=';
      volunteer.password = '58b29f79f1861119815a8374995530d84f05fd3532ee38e55fb796d35356911a953bb45a49be8803ceffb12f49e6e1ab1bd127a3be3cacce88242996e19051be715b20066747082224464dea269ef6e130322220d11c4e4c845a2d3ced9186a1ff1b197a02ebd1281e1fb9ff8aa03bc510c34934b48519355adda0d066f83b58714ed9f0191d985d7442cafcaa30426e257750ecb5831e91f0005c2abad7f644c3b561038b6bb75e9a3c46ac0310aba80a5574cc351f6c0e9046caedb107fdce31892a0d0599c18446665725dc51b5dc937657a1d144d2ac30ebff9ef627a7a09e6584934793ebbbee9d5f486f18a4bf979b521ecfea80f2348229bbe3e4ec7cab28c4a1274b27e994f4019c3cdb1dcb6200844b320edc13eaa082d3930331339e6816f51d4b13e6a8b2d7c9bb1b1d957aa778dfb13871b93af8a44a2e73ba1d17057c785c324e21f5a254efa1c402ed2bf460d7e79d8e104b99d8645ae7273b50b98aa74722909c46810ce84159ae30e6d903abf128f44e64242623324df749acbd5fca8f29f1b42392b868761cc7cc349a8cb78b5b26c468fab6a4a83b77bac4eb33c5b02d152da22fde38b16657e41559350b8bd9cfc674543557f0b811845c597f2d3db56cd46479cb4fbf13536ca90bdd63d956d7c67e0b053c04c52258aeb93fc288b0f3a8838c783afa82ce98199f77d83ccee906a6ccefd06ce346c6';

      assert.equal(volunteer.compareAuthenticatingPassword('password'), true, 'Compare authentication password failed to return true with valid salt and password');
    });

    it('Should return false if the stored salt and hash matches are wrong', () => {
      const volunteer = new Volunter();
      volunteer.salt = 'salt';
      volunteer.password = '58b29f79f1861119815a8374995530d84f05fd3532ee38e55fb796d35356911a953bb45a49be8803ceffb12f49e6e1ab1bd127a3be3cacce88242996e19051be715b20066747082224464dea269ef6e130322220d11c4e4c845a2d3ced9186a1ff1b197a02ebd1281e1fb9ff8aa03bc510c34934b48519355adda0d066f83b58714ed9f0191d985d7442cafcaa30426e257750ecb5831e91f0005c2abad7f644c3b561038b6bb75e9a3c46ac0310aba80a5574cc351f6c0e9046caedb107fdce31892a0d0599c18446665725dc51b5dc937657a1d144d2ac30ebff9ef627a7a09e6584934793ebbbee9d5f486f18a4bf979b521ecfea80f2348229bbe3e4ec7cab28c4a1274b27e994f4019c3cdb1dcb6200844b320edc13eaa082d3930331339e6816f51d4b13e6a8b2d7c9bb1b1d957aa778dfb13871b93af8a44a2e73ba1d17057c785c324e21f5a254efa1c402ed2bf460d7e79d8e104b99d8645ae7273b50b98aa74722909c46810ce84159ae30e6d903abf128f44e64242623324df749acbd5fca8f29f1b42392b868761cc7cc349a8cb78b5b26c468fab6a4a83b77bac4eb33c5b02d152da22fde38b16657e41559350b8bd9cfc674543557f0b811845c597f2d3db56cd46479cb4fbf13536ca90bdd63d956d7c67e0b053c04c52258aeb93fc288b0f3a8838c783afa82ce98199f77d83ccee906a6ccefd06ce346c6';

      assert.equal(volunteer.compareAuthenticatingPassword('password'), false, 'Compare authentication password passed when the salt was invalid');
    });

    it('Should return false if no password is passed', () => {
      const volunteer = new Volunter();
      volunteer.salt = 'salt';
      volunteer.password = '58b29f79f1861119815a8374995530d84f05fd3532ee38e55fb796d35356911a953bb45a49be8803ceffb12f49e6e1ab1bd127a3be3cacce88242996e19051be715b20066747082224464dea269ef6e130322220d11c4e4c845a2d3ced9186a1ff1b197a02ebd1281e1fb9ff8aa03bc510c34934b48519355adda0d066f83b58714ed9f0191d985d7442cafcaa30426e257750ecb5831e91f0005c2abad7f644c3b561038b6bb75e9a3c46ac0310aba80a5574cc351f6c0e9046caedb107fdce31892a0d0599c18446665725dc51b5dc937657a1d144d2ac30ebff9ef627a7a09e6584934793ebbbee9d5f486f18a4bf979b521ecfea80f2348229bbe3e4ec7cab28c4a1274b27e994f4019c3cdb1dcb6200844b320edc13eaa082d3930331339e6816f51d4b13e6a8b2d7c9bb1b1d957aa778dfb13871b93af8a44a2e73ba1d17057c785c324e21f5a254efa1c402ed2bf460d7e79d8e104b99d8645ae7273b50b98aa74722909c46810ce84159ae30e6d903abf128f44e64242623324df749acbd5fca8f29f1b42392b868761cc7cc349a8cb78b5b26c468fab6a4a83b77bac4eb33c5b02d152da22fde38b16657e41559350b8bd9cfc674543557f0b811845c597f2d3db56cd46479cb4fbf13536ca90bdd63d956d7c67e0b053c04c52258aeb93fc288b0f3a8838c783afa82ce98199f77d83ccee906a6ccefd06ce346c6';

      assert.equal(volunteer.compareAuthenticatingPassword(), false, 'Compare authentication password passed when the password was not given');
    });

    it('Should return false if there is no salt in the class', () => {
      const volunteer = new Volunter();
      volunteer.password = '58b29f79f1861119815a8374995530d84f05fd3532ee38e55fb796d35356911a953bb45a49be8803ceffb12f49e6e1ab1bd127a3be3cacce88242996e19051be715b20066747082224464dea269ef6e130322220d11c4e4c845a2d3ced9186a1ff1b197a02ebd1281e1fb9ff8aa03bc510c34934b48519355adda0d066f83b58714ed9f0191d985d7442cafcaa30426e257750ecb5831e91f0005c2abad7f644c3b561038b6bb75e9a3c46ac0310aba80a5574cc351f6c0e9046caedb107fdce31892a0d0599c18446665725dc51b5dc937657a1d144d2ac30ebff9ef627a7a09e6584934793ebbbee9d5f486f18a4bf979b521ecfea80f2348229bbe3e4ec7cab28c4a1274b27e994f4019c3cdb1dcb6200844b320edc13eaa082d3930331339e6816f51d4b13e6a8b2d7c9bb1b1d957aa778dfb13871b93af8a44a2e73ba1d17057c785c324e21f5a254efa1c402ed2bf460d7e79d8e104b99d8645ae7273b50b98aa74722909c46810ce84159ae30e6d903abf128f44e64242623324df749acbd5fca8f29f1b42392b868761cc7cc349a8cb78b5b26c468fab6a4a83b77bac4eb33c5b02d152da22fde38b16657e41559350b8bd9cfc674543557f0b811845c597f2d3db56cd46479cb4fbf13536ca90bdd63d956d7c67e0b053c04c52258aeb93fc288b0f3a8838c783afa82ce98199f77d83ccee906a6ccefd06ce346c6';

      assert.equal(volunteer.compareAuthenticatingPassword(), false, 'Compare authentication password passed when the salt was not even set');
    });

    it('Should return false if there is no passed in the class', () => {
      const volunteer = new Volunter();
      volunteer.salt = '5HomjhDxeSNT4H9JmD3iW7h0iUjLyDG7XnKbvQK+QYxN914GExndCEKI5azGaSNSZKcgPrjyxvO04GO/QN6FtRpaTYbOF3DAVU9U6i+1VfEMWcvOgb7sUmOb/OI48WRiPgcmatDmPMz89Ih0IspYq/Po+/UOnOMCEmDkfrfhlK8=';
      assert.equal(volunteer.compareAuthenticatingPassword(), false, 'Compare authentication password passed when the password was not even set');
    });
  });
});
