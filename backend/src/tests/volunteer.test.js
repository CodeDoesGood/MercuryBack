const _ = require('lodash');
const assert = require('assert');

const Volunter = require('../components/Volunteer');


describe('Volunteer Component', () => {
  describe('#Constructor', () => {
    it('Should contain all database elements', () => {
      const volunteer = new Volunter();

      assert.equal(_.isUndefined(volunteer.volunteer_id), false, 'Volunteer class must contain: "id"');
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

  if (!_.isNil(process.env.TRAVIS)) {
    return;
  }

  describe('#exists', () => {
    it('Should resolve if the volunteer exists', (done) => {
      const volunteer = new Volunter(1);

      volunteer.exists()
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should reject if the volunteer doesn\'t exists', (done) => {
      const volunteer = new Volunter(99999);

      volunteer.exists()
        .then(() => done(new Error('Exist shouldn\'t resolve when the volunteer doesn\'t exist')))
        .catch((error) => {
          assert.equal(error, 'Volunteer does not exist by type=volunteer_id', error);
          done();
        });
    });

    it('Should reject if the volunteer_id is not passed', (done) => {
      const volunteer = new Volunter();

      volunteer.exists()
        .then(() => done(new Error('Shouldn\'t resolve if the project_id is not set')))
        .catch((error) => {
          assert.equal(error, 'Type must be defined or valid, type=null', error);
          done();
        });
    });

    it('Should resolve when passing something other than the volunteer_id', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.exists('username')
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.exists('username').then((content) => {
        throw new Error(`exists Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#updatePassword', () => {
    it('Should update password for the volunteer if the password is given', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.exists('username')
        .then(() => volunteer.updatePassword('password'))
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should reject if no password is given', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.exists('username')
        .then(() => volunteer.updatePassword())
        .then(() => done('Updated password when no password was given'))
        .catch(() => done());
    });

    it('Should reject if the project_id is not a valid string or number', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.exists('username')
        .then(() => {
          volunteer.project_id = null;
          return volunteer.updatePassword();
        })
        .then(() => done('Updated password when the project_id was invalid'))
        .catch(() => done());
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.updatePassword('username').then((content) => {
        throw new Error(`exists Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#getVerificationCode', () => {
    it('Should resolve a verification code when one exists', (done) => {
      const volunteer = new Volunter(1);

      volunteer.removeVerificationCode()
        .then(() => volunteer.createVerificationCode())
        .then(() => volunteer.getVerificationCode())
        .then((code) => {
          assert.equal(!_.isNil(code.code), true, 'Content should contain a code');
          assert.equal(!_.isNil(code.verification_code_id), true, 'verification_code_id should be contained in the code');
          assert.equal(!_.isNil(code.salt), true, 'salt should be contained in the code');
          assert.equal(!_.isNil(code.created_datetime), true, 'created_datetime should be contained in the code');
          done();
        })
        .catch(error => done(new Error(error)))
        .finally(() => volunteer.removeVerificationCode());
    });

    it('Should resolve a null object if the volunteer does not exist', (done) => {
      const volunteer = new Volunter(99999);

      volunteer.getVerificationCode()
        .then((code) => {
          assert.equal(_.isNil(code), true, 'Code should be a null object if the volunteer does not exist');
          done();
        })
        .catch(error => done(new Error(error)));
    });

    it('Should reject if the volunteer_id is null or undefined', (done) => {
      const volunteer = new Volunter(null);

      volunteer.getVerificationCode()
        .then(() => done(new Error('Shoudln\'t resolve with a invalid volunteer_id')))
        .catch((error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
          done();
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.getVerificationCode().then((content) => {
        throw new Error(`getVerificationCode Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#removeVerificationCode', () => {
    it('Should reject if the volunteer_id is not valid', (done) => {
      const volunteer = new Volunter();

      volunteer.removeVerificationCode()
        .then(() => done(new Error('Shouldn\'t resolve when the volunteer_id is invalid')))
        .catch((error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
          done();
        });
    });

    it('Should resolve if a verification code exists', (done) => {
      const volunteer = new Volunter(1);

      volunteer.createVerificationCode()
        .then(() => volunteer.removeVerificationCode())
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should resolve if a verification code does not exist', (done) => {
      const volunteer = new Volunter(1);

      volunteer.createVerificationCode()
        .then(() => volunteer.removeVerificationCode())
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.removeVerificationCode().then((content) => {
        throw new Error(`removeVerificationCode Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#createVerificationCode', () => {
    it('Should resolve a verification code', (done) => {
      const volunteer = new Volunter(1);

      volunteer.removeVerificationCode()
        .then(() => volunteer.createVerificationCode())
        .then((code) => {
          assert.equal(!_.isNil(code), true, 'Code returned should not be null or undefined');
          assert.equal(_.isNumber(code), true, 'Code should be a valid number');
          done();
        })
        .catch(error => done(new Error(error)))
        .finally(() => volunteer.removeVerificationCode());
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.createVerificationCode().then((content) => {
        throw new Error(`createVerificationCode Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#createPasswordResetCode', () => {
    it('Should resolve a password reset code', (done) => {
      const volunteer = new Volunter(1);

      volunteer.removePasswordResetCode()
        .then(() => volunteer.createPasswordResetCode())
        .then((code) => {
          assert.equal(!_.isNil(code), true, 'Code returned should not be null or undefined');
          assert.equal(_.isNumber(code), true, 'Code should be a valid number');
          done();
        })
        .catch(error => done(new Error(error)))
        .finally(() => volunteer.removePasswordResetCode());
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.createPasswordResetCode().then((content) => {
        throw new Error(`createPasswordResetCode Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#getPasswordResetCode', () => {
    it('Should resolve a verification code when one exists', (done) => {
      const volunteer = new Volunter(1);

      volunteer.removePasswordResetCode()
        .then(() => volunteer.createPasswordResetCode())
        .then(() => volunteer.getPasswordResetCode())
        .then((code) => {
          assert.equal(!_.isNil(code.code), true, 'Content should contain a code');
          assert.equal(!_.isNil(code.password_reset_code_id), true, 'verification_code_id should be contained in the code');
          assert.equal(!_.isNil(code.salt), true, 'salt should be contained in the code');
          assert.equal(!_.isNil(code.created_datetime), true, 'created_datetime should be contained in the code');
          done();
        })
        .catch(error => done(new Error(error)))
        .finally(() => volunteer.removePasswordResetCode());
    });

    it('Should resolve a null object if the volunteer does not exist', (done) => {
      const volunteer = new Volunter(99999);

      volunteer.getPasswordResetCode()
        .then((code) => {
          assert.equal(_.isNil(code), true, 'Code should be a null object if the volunteer does not exist');
          done();
        })
        .catch(error => done(new Error(error)));
    });

    it('Should reject if the volunteer_id is null or undefined', (done) => {
      const volunteer = new Volunter(null);

      volunteer.getPasswordResetCode()
        .then(() => done(new Error('Shoudln\'t resolve with a invalid volunteer_id')))
        .catch((error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
          done();
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.getPasswordResetCode().then((content) => {
        throw new Error(`getPasswordResetCode Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#removePasswordResetCode', () => {
    it('Should reject if the volunteer_id is not valid', (done) => {
      const volunteer = new Volunter();

      volunteer.removePasswordResetCode()
        .then(() => done(new Error('Shouldn\'t resolve when the volunteer_id is invalid')))
        .catch((error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
          done();
        });
    });

    it('Should resolve if a verification code exists', (done) => {
      const volunteer = new Volunter(1);

      volunteer.createPasswordResetCode()
        .then(() => volunteer.removePasswordResetCode())
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should resolve if a verification code does not exist', (done) => {
      const volunteer = new Volunter(1);

      volunteer.createPasswordResetCode()
        .then(() => volunteer.removePasswordResetCode())
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.removePasswordResetCode().then((content) => {
        throw new Error(`removeVerificationCode Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#doesPasswordResetCodeExist', () => {
    it('Should reject if no password reset code exists', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.exists('username')
        .then(() => volunteer.removePasswordResetCode())
        .then(() => volunteer.doesPasswordResetCodeExist())
        .then(() => done(new Error('Shouldn\'t resolve when no password reset code exists')))
        .catch((error) => {
          assert.equal(error, `No password reset code exists for user ${volunteer.volunteer_id}`, error);
          done();
        });
    });

    it('Should resolve if there is a existing reset code', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.exists('username')
        .then(() => volunteer.createPasswordResetCode())
        .then(() => volunteer.doesPasswordResetCodeExist())
        .then(() => done())
        .catch(error => done(new Error(`Shouldn't reject when a password reset code exists, error=${error}`)))
        .finally(() => volunteer.removePasswordResetCode());
    });

    it('Should reject if the project_id is invalid', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.doesPasswordResetCodeExist()
        .then(() => done(new Error('Shouldn\'t resolve when a the project_id is invalid')))
        .catch((error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
          done();
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.doesPasswordResetCodeExist().then((content) => {
        throw new Error(`doesPasswordResetCodeExist Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#verify', () => {
    it('Should mark there account and object as verified', (done) => {
      const volunteer = new Volunter(1);

      volunteer.exists()
        .then(() => volunteer.verify())
        .then(() => volunteer.exists())
        .then(() => {
          assert.equal(volunteer.verified, true, 'After regathering the acccount, it should be verified');
          done();
        });
    });

    it('Should reject if the project_id is invalid', (done) => {
      const volunteer = new Volunter();

      volunteer.verify()
        .then(() => done(new Error('shouldn\'t resolve when the project_id is invalid')))
        .catch((error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
          done();
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.verify().then((content) => {
        throw new Error(`verify Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#create', () => {
    it('Should create the user in the database and create a verification code', (done) => {
      const volunteer = new Volunter(null, 'randomvalidusername');

      volunteer.email = 'randomvalidemail@randomvalideamil.co.uk';
      volunteer.name = 'random validname';

      volunteer.create('thepassword', 1)
        .then((verification) => {
          assert.equal(!_.isNil(verification), true, 'Returned verification code cannot be null or undefined');
          return volunteer.exists('username');
        })
        .then(() => volunteer.getVerificationCode())
        .then((code) => {
          assert.equal(!_.isNil(code), true, 'After creating the account a verification code should exit');
          return volunteer.removeVerificationCode();
        })
        .then(() => volunteer.knex('volunteer').where('volunteer_id', volunteer.volunteer_id).del())
        .then(() => done())
        .catch(error => done(new Error(error)));
    });

    it('Should reject if the volunteer name is undefined or null', (done) => {
      const volunteer = new Volunter(null, 'randomvalidusername');

      volunteer.email = 'theemail@theemail.com';

      volunteer.create()
        .then(() => done(new Error('volunteer creation shouldn\'t create the name is not defined.')))
        .catch((error) => {
          assert.equal(error, `name, username, email and password are required, name=${volunteer.name}, username=${volunteer.username}, email=${volunteer.email}`, error);
          done();
        });
    });

    it('Should reject if the volunteer email is undefined or null', (done) => {
      const volunteer = new Volunter(null, 'randomvalidusername');

      volunteer.name = 'the name';

      volunteer.create('thepassword')
        .then(() => done(new Error('volunteer creation shouldn\'t create the name is not defined.')))
        .catch((error) => {
          assert.equal(error, `name, username, email and password are required, name=${volunteer.name}, username=${volunteer.username}, email=${volunteer.email}`, error);
          done();
        });
    });

    it('Should reject if the volunteer username is undefined or null', (done) => {
      const volunteer = new Volunter();

      volunteer.name = 'the name';
      volunteer.email = 'theemail@themail.com';

      volunteer.create('thepassword')
        .then(() => done(new Error('volunteer creation shouldn\'t create the name is not defined.')))
        .catch((error) => {
          assert.equal(error, `name, username, email and password are required, name=${volunteer.name}, username=${volunteer.username}, email=${volunteer.email}`, error);
          done();
        });
    });

    it('Should reject if the password is not provided', (done) => {
      const volunteer = new Volunter(null, 'theusername');

      volunteer.name = 'the name';
      volunteer.email = 'the email';

      volunteer.create()
        .then(() => done(new Error('Creation shouldn\'t resolve when no password is given')))
        .catch((error) => {
          assert.equal(error, `You must provide a password to create the volunteer=${volunteer.username}`, error);
          done();
        });
    });

    it('Should reject if the connection details are incorrect', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      volunteer.name = 'the name';
      volunteer.email = 'theemail@themail.com';

      return volunteer.create('thepassword').then((content) => {
        throw new Error(`create Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });

  describe('#doesVerificationCodeExist', () => {
    it('Should reject if no verification code exists', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.exists('username')
        .then(() => volunteer.removeVerificationCode())
        .then(() => volunteer.doesVerificationCodeExist())
        .then(() => done(new Error('Shouldn\'t resolve when no password reset code exists')))
        .catch((error) => {
          assert.equal(error, `No verification code exists for user ${volunteer.volunteer_id}`, error);
          done();
        });
    });

    it('Should resolve if there is a existing verification code code', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.exists('username')
        .then(() => volunteer.createVerificationCode())
        .then(() => volunteer.doesVerificationCodeExist())
        .then(() => done())
        .catch(error => done(new Error(`Shouldn't reject when a password reset code exists, error=${error}`)))
        .finally(() => volunteer.removeVerificationCode());
    });

    it('Should reject if the project_id is invalid', (done) => {
      const volunteer = new Volunter(null, 'user1');

      volunteer.doesVerificationCodeExist()
        .then(() => done(new Error('Shouldn\'t resolve when a the project_id is invalid')))
        .catch((error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
          done();
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.doesVerificationCodeExist().then((content) => {
        throw new Error(`doesVerificationCodeExist Shouldn't of resolved when the connection details are wrong, ${content}`);
      }, (error) => {
        volunteer.info.connection.user = username;
        assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
      });
    });
  });
});
