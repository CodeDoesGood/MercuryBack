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
    it('Should resolve if the volunteer exists', () => {
      const volunteer = new Volunter(1);

      return volunteer.exists()
        .then(() => {
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if the volunteer doesn\'t exists', () => {
      const volunteer = new Volunter(99999);

      return volunteer.exists()
        .then(() => {
          throw new Error('Exist shouldn\'t resolve when the volunteer doesn\'t exist');
        }, (error) => {
          assert.equal(error, 'Volunteer does not exist by type=volunteer_id', error);
        });
    });

    it('Should reject if the volunteer_id is not passed', () => {
      const volunteer = new Volunter();

      return volunteer.exists()
        .then(() => {
          throw new Error('Shouldn\'t resolve if the project_id is not set');
        }, (error) => {
          assert.equal(error, 'Type must be defined or valid, type=null', error);
        });
    });

    it('Should resolve when passing something other than the volunteer_id', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => {
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.exists('username')
        .then((content) => {
          throw new Error(`exists shouldn't have resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#updatePassword', () => {
    it('Should update password for the volunteer if the password is given', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => volunteer.updatePassword('password'))
        .then(() => {
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if no password is given', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => volunteer.updatePassword())
        .then(() => {
          throw new Error('Should not resolve if no password is given');
        }, () => {});
    });

    it('Should reject if the project_id is not a valid string or number', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => {
          volunteer.project_id = null;
          return volunteer.updatePassword();
        })
        .then(() => {
          throw new Error('Updated password when the project_id was invalid');
        }, () => {});
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.updatePassword('username')
        .then((content) => {
          throw new Error(`exists Shouldn't have resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#getVerificationCode', () => {
    it('Should resolve a verification code when one exists', () => {
      const volunteer = new Volunter(1);

      return volunteer.removeVerificationCode()
        .then(() => volunteer.createVerificationCode())
        .then(() => volunteer.getVerificationCode())
        .then((code) => {
          assert.equal(!_.isNil(code.code), true, 'Content should contain a code');
          assert.equal(!_.isNil(code.verification_code_id), true, 'verification_code_id should be contained in the code');
          assert.equal(!_.isNil(code.salt), true, 'salt should be contained in the code');
          assert.equal(!_.isNil(code.created_datetime), true, 'created_datetime should be contained in the code');
        }, (error) => { throw new Error(error); })
        .finally(() => volunteer.removeVerificationCode());
    });

    it('Should resolve a null object if the volunteer does not exist', () => {
      const volunteer = new Volunter(99999);

      return volunteer.getVerificationCode()
        .then((code) => {
          assert.equal(_.isNil(code), true, 'Code should be a null object if the volunteer does not exist');
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if the volunteer_id is null or undefined', () => {
      const volunteer = new Volunter(null);

      return volunteer.getVerificationCode()
        .then(() => {
          throw new Error('Shoudln\'t resolve with a invalid volunteer_id');
        }, (error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.getVerificationCode()
        .then((content) => {
          throw new Error(`getVerificationCode Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#removeVerificationCode', () => {
    it('Should reject if the volunteer_id is not valid', () => {
      const volunteer = new Volunter();

      return volunteer.removeVerificationCode()
        .then(() => {
          throw new Error('Shouldn\'t resolve when the volunteer_id is invalid');
        }, (error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
        });
    });

    it('Should resolve if a verification code exists', () => {
      const volunteer = new Volunter(1);

      return volunteer.createVerificationCode()
        .then(() => volunteer.removeVerificationCode())
        .then(() => {}, (error) => { throw new Error(error); });
    });

    it('Should resolve if a verification code does not exist', () => {
      const volunteer = new Volunter(1);

      return volunteer.createVerificationCode()
        .then(() => volunteer.removeVerificationCode())
        .then(() => {}, (error) => { throw new Error(error); });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.removeVerificationCode()
        .then((content) => {
          throw new Error(`removeVerificationCode Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#createVerificationCode', () => {
    it('Should resolve a verification code', () => {
      const volunteer = new Volunter(1);

      return volunteer.removeVerificationCode()
        .then(() => volunteer.createVerificationCode())
        .then((code) => {
          assert.equal(!_.isNil(code), true, 'Code returned should not be null or undefined');
          assert.equal(_.isNumber(code), true, 'Code should be a valid number');
        }, (error) => { throw new Error(error); })
        .finally(() => volunteer.removeVerificationCode());
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.createVerificationCode()
        .then((content) => {
          throw new Error(`createVerificationCode Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#createPasswordResetCode', () => {
    it('Should resolve a password reset code', () => {
      const volunteer = new Volunter(1);

      return volunteer.removePasswordResetCode()
        .then(() => volunteer.createPasswordResetCode())
        .then((code) => {
          assert.equal(!_.isNil(code), true, 'Code returned should not be null or undefined');
          assert.equal(_.isNumber(code), true, 'Code should be a valid number');
        }, (error) => { throw new Error(error); })
        .finally(() => volunteer.removePasswordResetCode());
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.createPasswordResetCode()
        .then((content) => {
          throw new Error(`createPasswordResetCode Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#getPasswordResetCode', () => {
    it('Should resolve a verification code when one exists', () => {
      const volunteer = new Volunter(1);

      return volunteer.removePasswordResetCode()
        .then(() => volunteer.createPasswordResetCode())
        .then(() => volunteer.getPasswordResetCode())
        .then((code) => {
          assert.equal(!_.isNil(code.code), true, 'Content should contain a code');
          assert.equal(!_.isNil(code.password_reset_code_id), true, 'verification_code_id should be contained in the code');
          assert.equal(!_.isNil(code.salt), true, 'salt should be contained in the code');
          assert.equal(!_.isNil(code.created_datetime), true, 'created_datetime should be contained in the code');
        }, (error) => { throw new Error(error); })
        .finally(() => volunteer.removePasswordResetCode());
    });

    it('Should resolve a null object if the volunteer does not exist', () => {
      const volunteer = new Volunter(99999);

      return volunteer.getPasswordResetCode()
        .then((code) => {
          assert.equal(_.isNil(code), true, 'Code should be a null object if the volunteer does not exist');
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if the volunteer_id is null or undefined', () => {
      const volunteer = new Volunter(null);

      volunteer.getPasswordResetCode()
        .then(() => {
          throw new Error('Shoudln\'t resolve with a invalid volunteer_id');
        }, (error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.getPasswordResetCode()
        .then((content) => {
          throw new Error(`getPasswordResetCode Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#removePasswordResetCode', () => {
    it('Should reject if the volunteer_id is not valid', () => {
      const volunteer = new Volunter();

      return volunteer.removePasswordResetCode()
        .then(() => {
          throw new Error('Shouldn\'t resolve when the volunteer_id is invalid');
        }, (error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
        });
    });

    it('Should resolve if a verification code exists', () => {
      const volunteer = new Volunter(1);

      return volunteer.createPasswordResetCode()
        .then(() => volunteer.removePasswordResetCode())
        .then(() => {}, (error) => { throw new Error(error); });
    });

    it('Should resolve if a verification code does not exist', () => {
      const volunteer = new Volunter(1);

      volunteer.createPasswordResetCode()
        .then(() => volunteer.removePasswordResetCode())
        .then(() => {}, (error) => { throw new Error(error); });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.removePasswordResetCode()
        .then((content) => {
          throw new Error(`removeVerificationCode Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#doesPasswordResetCodeExist', () => {
    it('Should reject if no password reset code exists', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => volunteer.removePasswordResetCode())
        .then(() => volunteer.doesPasswordResetCodeExist())
        .then(() => {
          throw new Error('Shouldn\'t resolve when no password reset code exists');
        }, (error) => {
          assert.equal(error, `No password reset code exists for user ${volunteer.volunteer_id}`, error);
        });
    });

    it('Should resolve if there is a existing reset code', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => volunteer.createPasswordResetCode())
        .then(() => volunteer.doesPasswordResetCodeExist())
        .then(() => {
        }, (error) => { throw new Error(`Shouldn't reject when a password reset code exists, error=${error}`); })
        .finally(() => volunteer.removePasswordResetCode());
    });

    it('Should reject if the project_id is invalid', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.doesPasswordResetCodeExist()
        .then(() => {
          throw new Error('Shouldn\'t resolve when a the project_id is invalid');
        }, (error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.doesPasswordResetCodeExist()
        .then((content) => {
          throw new Error(`doesPasswordResetCodeExist Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#verify', () => {
    it('Should mark there account and object as verified', () => {
      const volunteer = new Volunter(1);

      return volunteer.exists()
        .then(() => volunteer.verify())
        .then(() => volunteer.exists())
        .then(() => {
          assert.equal(volunteer.verified, true, 'After regathering the acccount, it should be verified');
        }, (error) => { throw new Error(error); });
    });

    it('Should reject if the project_id is invalid', () => {
      const volunteer = new Volunter();

      return volunteer.verify()
        .then(() => {
          throw new Error('shouldn\'t resolve when the project_id is invalid');
        }, (error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.verify()
        .then((content) => {
          throw new Error(`verify Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#create', () => {
    it('Should create the user in the database and create a verification code', () => {
      const volunteer = new Volunter(null, 'randomvalidusername');

      volunteer.email = 'randomvalidemail@randomvalideamil.co.uk';
      volunteer.name = 'random validname';

      return volunteer.create('thepassword', 1)
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
        .then(() => {}, (error) => { throw new Error(error); });
    });

    it('Should reject if the volunteer name is undefined or null', () => {
      const volunteer = new Volunter(null, 'randomvalidusername');

      volunteer.email = 'theemail@theemail.com';

      return volunteer.create()
        .then(() => {
          throw new Error('volunteer creation shouldn\'t create the name is not defined.');
        }, (error) => {
          assert.equal(error, `name, username, email and password are required, name=${volunteer.name}, username=${volunteer.username}, email=${volunteer.email}`, error);
        });
    });

    it('Should reject if the volunteer email is undefined or null', () => {
      const volunteer = new Volunter(null, 'randomvalidusername');

      volunteer.name = 'the name';

      return volunteer.create('thepassword')
        .then(() => {
          throw new Error('volunteer creation shouldn\'t create the name is not defined.');
        }, (error) => {
          assert.equal(error, `name, username, email and password are required, name=${volunteer.name}, username=${volunteer.username}, email=${volunteer.email}`, error);
        });
    });

    it('Should reject if the volunteer username is undefined or null', () => {
      const volunteer = new Volunter();

      volunteer.name = 'the name';
      volunteer.email = 'theemail@themail.com';

      return volunteer.create('thepassword')
        .then(() => {
          throw new Error('volunteer creation shouldn\'t create the name is not defined.');
        }, (error) => {
          assert.equal(error, `name, username, email and password are required, name=${volunteer.name}, username=${volunteer.username}, email=${volunteer.email}`, error);
        });
    });

    it('Should reject if the password is not provided', () => {
      const volunteer = new Volunter(null, 'theusername');

      volunteer.name = 'the name';
      volunteer.email = 'the email';

      return volunteer.create()
        .then(() => {
          throw new Error('Creation shouldn\'t resolve when no password is given');
        }, (error) => {
          assert.equal(error, `You must provide a password to create the volunteer=${volunteer.username}`, error);
        });
    });

    it('Should reject if the connection details are incorrect', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      volunteer.name = 'the name';
      volunteer.email = 'theemail@themail.com';

      return volunteer.create('thepassword')
        .then((content) => {
          throw new Error(`create Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#doesVerificationCodeExist', () => {
    it('Should reject if no verification code exists', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => volunteer.removeVerificationCode())
        .then(() => volunteer.doesVerificationCodeExist())
        .then(() => {
          throw new Error('Shouldn\'t resolve when no password reset code exists');
        }, (error) => {
          assert.equal(error, `No verification code exists for user ${volunteer.volunteer_id}`, error);
        });
    });

    it('Should resolve if there is a existing verification code code', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => volunteer.createVerificationCode())
        .then(() => volunteer.doesVerificationCodeExist())
        .then(() => {
        }, (error) => {
          throw new Error(`Shouldn't reject when a password reset code exists, error=${error}`);
        })
        .finally(() => volunteer.removeVerificationCode());
    });

    it('Should reject if the project_id is invalid', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.doesVerificationCodeExist()
        .then(() => {
          throw new Error('Shouldn\'t resolve when a the project_id is invalid');
        }, (error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.doesVerificationCodeExist()
        .then((content) => {
          throw new Error(`doesVerificationCodeExist Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#getActiveNotifications', () => {
    it('Should return all active notifications if notifications exist for the user', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => volunteer.getActiveNotifications())
        .then((notifications) => {
          assert.equal(!_.isNil(notifications[0]), true, `Notificaitons should be returned instead of a empty array, ${notifications}`);

          _.forEach(notifications, (notification) => {
            assert.equal(!_.isNil(notification.announcement_id), true, 'Announcement_id should not be undefined or null');
            assert.equal(!_.isNil(notification.data_entry_user_id), true, 'data_entry_user_id should not be undefined or null');
            assert.equal(!_.isNil(notification.title), true, 'title should not be undefined or null');
            assert.equal(!_.isNil(notification.body), true, 'body should not be undefined or null');
            assert.equal(!_.isNil(notification.announcement_type), true, 'announcement_type should not be undefined or null');
            assert.equal(!_.isNil(notification.created_datetime), true, 'created_datetime should not be undefined or null');
            assert.equal(!_.isNil(notification.modified_datetime), true, 'modified_datetime should not be undefined or null');
          });
        }, (error) => {
          throw new Error(error);
        });
    });

    it('Should return a empty array if no notifications exist', () => {
      const volunteer = new Volunter(null, 'user2');

      return volunteer.exists('username')
        .then(() => volunteer.getActiveNotifications())
        .then((notifications) => {
          assert.equal(_.isNil(notifications[0]), true, `Should of returned null if there is no notifications for that user, notifications=${notifications}`);
        }, (error) => {
          throw new Error(error);
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.getActiveNotifications()
        .then((content) => {
          throw new Error(`getActiveNotifications Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });

  describe('#dismissNotification', () => {
    it('Should return 200 if its marked it as read', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.exists('username')
        .then(() => volunteer.dismissNotification(1))
        .then(() => {
        }, (error) => {
          throw new Error(error);
        }).finally(() => volunteer.knex('volunteer_announcement').where({
          volunteer_announcement_id: 1,
        }).update({
          read: false,
          read_date: null,
        }));
    });

    it('Should reject if the volunteer id does not exist', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.dismissNotification(1)
        .then(() => {
          throw new Error('Dismiss should reject if the volunteer id does not exist');
        }, (error) => {
          assert.equal(error, `volunteerId "${volunteer.volunteer_id}" passed is not a valid number`, error);
        });
    });

    it('should not mark it as read if its not the correct voluteer_id', () => {
      const volunteer = new Volunter(null, 'user1');
      let totalNotifications = 0;
      let oldVolunteerId = 0;

      return volunteer.exists('username')
        .then(() => volunteer.getActiveNotifications())
        .then((notifications) => {
          totalNotifications = notifications.length;
          oldVolunteerId = volunteer.volunteer_id;
          volunteer.volunteer_id = 99;
          return volunteer.dismissNotification(1);
        })
        .then(() => {
          volunteer.volunteer_id = oldVolunteerId;
          return volunteer.getActiveNotifications();
        })
        .then((newNotifications) => {
          assert.equal(totalNotifications, newNotifications.length, 'new Notifications should not change when the volunteer_id is not correct');
        }, (error) => {
          throw new Error(error);
        });
    });

    it('Should reject if the announcement id is not passed', () => {
      const volunteer = new Volunter(null, 'user1');

      return volunteer.dismissNotification()
        .then(() => {
          throw new Error('Dismiss should reject if the announcement id is not passed');
        }, (error) => {
          assert.equal(error, 'Announcement Id must be passed and also a valid number, announcement id=undefined', error);
        });
    });

    it('Should reject if the connection details are wrong', () => {
      const volunteer = new Volunter(null, 'user1');
      const username = volunteer.info.connection.user;
      volunteer.info.connection.user = 'wrongusername';
      volunteer.volunteer_id = 1;

      return volunteer.dismissNotification(1)
        .then((content) => {
          throw new Error(`dismissNotification Shouldn't of resolved when the connection details are wrong, ${content}`);
        }, (error) => {
          volunteer.info.connection.user = username;
          assert.equal(error.message.indexOf('ER_ACCESS_DENIED_ERROR') >= 0, true, error);
        });
    });
  });
});
