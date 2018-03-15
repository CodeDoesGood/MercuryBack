import * as assert from 'assert';
import * as _ from 'lodash';

import * as utils from '../../utils';

import { Administrator } from '../..//administrator';
import { IAnnouncement, IPasswordResetCode, IVerificationCode } from '../..//user';
import { Volunteer } from '../..//volunteer';

describe('Volunteer Component', () => {
  describe('#Constructor', () => {
    it('Should contain all database elements', () => {
      const volunteer = new Volunteer();

      assert.equal(_.isUndefined(volunteer.password), false, 'Volunteer class must contain: "password"');
      assert.equal(_.isUndefined(volunteer.position), false, 'Volunteer class must contain: "position"');
      assert.equal(_.isUndefined(volunteer.volunteerStatus), false, 'Volunteer class must contain: "volunteerStatus"');
      assert.equal(_.isUndefined(volunteer.name), false, 'Volunteer class must contain: "name"');
      assert.equal(_.isUndefined(volunteer.about), false, 'Volunteer class must contain: "about"');
      assert.equal(_.isUndefined(volunteer.phone), false, 'Volunteer class must contain: "phone"');
      assert.equal(_.isUndefined(volunteer.location), false, 'Volunteer class must contain: "location"');
      assert.equal(_.isUndefined(volunteer.timezone), false, 'Volunteer class must contain: "timezone"');
      assert.equal(_.isUndefined(volunteer.linkedInUrl), false, 'Volunteer class must contain: "linkedInUrl"');
      assert.equal(_.isUndefined(volunteer.slackId), false, 'Volunteer class must contain: "slackId"');
      assert.equal(_.isUndefined(volunteer.githubId), false, 'Volunteer class must contain: "githubId"');
      assert.equal(_.isUndefined(volunteer.developerLevel), false, 'Volunteer class must contain: "developerLevel"');
      assert.equal(_.isUndefined(volunteer.adminPortalAccess), false, 'Volunteer class must contain: "adminPortalAccess"');
      assert.equal(_.isUndefined(volunteer.adminOverallLevel), false, 'Volunteer class must contain: "adminOverallLevel"');
      assert.equal(_.isUndefined(volunteer.verified), false, 'Volunteer class must contain: "verified"');
      assert.equal(_.isUndefined(volunteer.email), false, 'Volunteer class must contain: "email"');
      assert.equal(_.isUndefined(volunteer.salt), false, 'Volunteer class must contain: "salt"');
    });

    it('Should throw a error when a provided userId is not a int', () => {
      const userId: any = '1';

      try {
        const volunteer = new Volunteer(userId);
      } catch (error) {
        assert.equal(error.message, 'When provided userId must be a integer', 'When provided userId must be a integer');
      }
    });

    it('Should throw a error when a provided username is not a string', () => {
      const volunteerString: any = 1;

      try {
        const volunteer = new Volunteer(null, volunteerString);
      } catch (error) {
        assert.equal(error.message, 'When provided username must be a string', 'When provided username must be a string');
      }
    });
  });

  describe('#getVerification', () => {
    it('Should return true if volunteer verification is set to true', () => {
      const volunteer = new Volunteer(null, 'username');
      volunteer.verified = true;

      assert.equal(volunteer.getVerification(), true, 'Volunteer verified should return true if it is set to true');
    });

    it('Should return false if volunteer verification is set to false', () => {
      const volunteer = new Volunteer(null, 'username');
      volunteer.verified = false;

      assert.equal(volunteer.getVerification(), false, 'Volunteer verified should return false if it is set to false');
    });

    it('Should return false if the username is null or not passed', async () => {
      const volunteer = new Volunteer();
      volunteer.verified = true;

      try {
        const verification: boolean = await volunteer.getVerification();
      } catch (error) {
        assert(true);
      }
    });
  });

  describe('#compareAuthenticatingPassword', () => {
    it('Should return true if the stored salt and hash match the passed password', () => {
      const volunteer = new Volunteer();
      volunteer.salt = '5HomjhDxeSNT4H9JmD3iW7h0iUjLyDG7XnKbvQK+QYxN914GExndCEKI5azGaSNSZKcgPrjyxvO04GO/QN6FtRpaTYbOF3DAVU9U6i' +
      '+1VfEMWcvOgb7sUmOb/OI48WRiPgcmatDmPMz89Ih0IspYq/Po+/UOnOMCEmDkfrfhlK8=';

      volunteer.password = '58b29f79f1861119815a8374995530d84f05fd3532ee38e55fb796d35356911a953bb45a49be8803ceffb12f49e6e1ab1bd1' +
      '27a3be3cacce88242996e19051be715b20066747082224464dea269ef6e130322220d11c4e4c845a2d3ced9186a1ff1b197a02ebd1281e1fb9ff8aa03bc' +
      '510c34934b48519355adda0d066f83b58714ed9f0191d985d7442cafcaa30426e257750ecb5831e91f0005c2abad7f644c3b561038b6bb75e9a3c46ac031' +
      '0aba80a5574cc351f6c0e9046caedb107fdce31892a0d0599c18446665725dc51b5dc937657a1d144d2ac30ebff9ef627a7a09e6584934793ebbbee9d5f4' +
      '86f18a4bf979b521ecfea80f2348229bbe3e4ec7cab28c4a1274b27e994f4019c3cdb1dcb6200844b320edc13eaa082d3930331339e6816f51d4b13e6a8b' +
      '2d7c9bb1b1d957aa778dfb13871b93af8a44a2e73ba1d17057c785c324e21f5a254efa1c402ed2bf460d7e79d8e104b99d8645ae7273b50b98aa74722909' +
      'c46810ce84159ae30e6d903abf128f44e64242623324df749acbd5fca8f29f1b42392b868761cc7cc349a8cb78b5b26c468fab6a4a83b77bac4eb33c5b02' +
      'd152da22fde38b16657e41559350b8bd9cfc674543557f0b811845c597f2d3db56cd46479cb4fbf13536ca90bdd63d956d7c67e0b053c04c52258aeb93fc' +
      '288b0f3a8838c783afa82ce98199f77d83ccee906a6ccefd06ce346c6';

      assert.equal(
        utils.compareAuthenticatingPassword('password', volunteer.salt, volunteer.password),
        true, 'Compare authentication password failed to return true with valid salt and password');
    });

    it('Should return false if the stored salt and hash matches are wrong', () => {
      const volunteer = new Volunteer();
      volunteer.salt = 'salt';

      volunteer.password = '58b29f79f1861119815a8374995530d84f05fd3532ee38e55fb796d35356911a953bb45a49be8803ceffb12f49e6e1ab1bd1' +
      '27a3be3cacce88242996e19051be715b20066747082224464dea269ef6e130322220d11c4e4c845a2d3ced9186a1ff1b197a02ebd1281e1fb9ff8aa03bc' +
      '510c34934b48519355adda0d066f83b58714ed9f0191d985d7442cafcaa30426e257750ecb5831e91f0005c2abad7f644c3b561038b6bb75e9a3c46ac031' +
      '0aba80a5574cc351f6c0e9046caedb107fdce31892a0d0599c18446665725dc51b5dc937657a1d144d2ac30ebff9ef627a7a09e6584934793ebbbee9d5f4' +
      '86f18a4bf979b521ecfea80f2348229bbe3e4ec7cab28c4a1274b27e994f4019c3cdb1dcb6200844b320edc13eaa082d3930331339e6816f51d4b13e6a8b' +
      '2d7c9bb1b1d957aa778dfb13871b93af8a44a2e73ba1d17057c785c324e21f5a254efa1c402ed2bf460d7e79d8e104b99d8645ae7273b50b98aa74722909' +
      'c46810ce84159ae30e6d903abf128f44e64242623324df749acbd5fca8f29f1b42392b868761cc7cc349a8cb78b5b26c468fab6a4a83b77bac4eb33c5b02' +
      'd152da22fde38b16657e41559350b8bd9cfc674543557f0b811845c597f2d3db56cd46479cb4fbf13536ca90bdd63d956d7c67e0b053c04c52258aeb93fc' +
      '288b0f3a8838c783afa82ce98199f77d83ccee906a6ccefd06ce346c6';

      assert.equal(
        utils.compareAuthenticatingPassword('password', volunteer.salt, volunteer.password),
        false, 'Compare authentication password passed when the salt was invalid');
    });

    it('Should return false if no password is passed', () => {
      const volunteer = new Volunteer();
      volunteer.salt = 'salt';

      volunteer.password = '58b29f79f1861119815a8374995530d84f05fd3532ee38e55fb796d35356911a953bb45a49be8803ceffb12f49e6e1ab1bd1' +
      '27a3be3cacce88242996e19051be715b20066747082224464dea269ef6e130322220d11c4e4c845a2d3ced9186a1ff1b197a02ebd1281e1fb9ff8aa03bc' +
      '510c34934b48519355adda0d066f83b58714ed9f0191d985d7442cafcaa30426e257750ecb5831e91f0005c2abad7f644c3b561038b6bb75e9a3c46ac031' +
      '0aba80a5574cc351f6c0e9046caedb107fdce31892a0d0599c18446665725dc51b5dc937657a1d144d2ac30ebff9ef627a7a09e6584934793ebbbee9d5f4' +
      '86f18a4bf979b521ecfea80f2348229bbe3e4ec7cab28c4a1274b27e994f4019c3cdb1dcb6200844b320edc13eaa082d3930331339e6816f51d4b13e6a8b' +
      '2d7c9bb1b1d957aa778dfb13871b93af8a44a2e73ba1d17057c785c324e21f5a254efa1c402ed2bf460d7e79d8e104b99d8645ae7273b50b98aa74722909' +
      'c46810ce84159ae30e6d903abf128f44e64242623324df749acbd5fca8f29f1b42392b868761cc7cc349a8cb78b5b26c468fab6a4a83b77bac4eb33c5b02' +
      'd152da22fde38b16657e41559350b8bd9cfc674543557f0b811845c597f2d3db56cd46479cb4fbf13536ca90bdd63d956d7c67e0b053c04c52258aeb93fc' +
      '288b0f3a8838c783afa82ce98199f77d83ccee906a6ccefd06ce346c6';

      assert.equal(
        utils.compareAuthenticatingPassword(undefined, volunteer.salt, volunteer.password),
        false, 'Compare authentication password passed when the password was not given');
    });

    it('Should return false if there is no salt in the class', () => {
      const volunteer = new Volunteer();

      volunteer.password = '58b29f79f1861119815a8374995530d84f05fd3532ee38e55fb796d35356911a953bb45a49be8803ceffb12f49e6e1ab1bd1' +
      '27a3be3cacce88242996e19051be715b20066747082224464dea269ef6e130322220d11c4e4c845a2d3ced9186a1ff1b197a02ebd1281e1fb9ff8aa03bc' +
      '510c34934b48519355adda0d066f83b58714ed9f0191d985d7442cafcaa30426e257750ecb5831e91f0005c2abad7f644c3b561038b6bb75e9a3c46ac031' +
      '0aba80a5574cc351f6c0e9046caedb107fdce31892a0d0599c18446665725dc51b5dc937657a1d144d2ac30ebff9ef627a7a09e6584934793ebbbee9d5f4' +
      '86f18a4bf979b521ecfea80f2348229bbe3e4ec7cab28c4a1274b27e994f4019c3cdb1dcb6200844b320edc13eaa082d3930331339e6816f51d4b13e6a8b' +
      '2d7c9bb1b1d957aa778dfb13871b93af8a44a2e73ba1d17057c785c324e21f5a254efa1c402ed2bf460d7e79d8e104b99d8645ae7273b50b98aa74722909' +
      'c46810ce84159ae30e6d903abf128f44e64242623324df749acbd5fca8f29f1b42392b868761cc7cc349a8cb78b5b26c468fab6a4a83b77bac4eb33c5b02' +
      'd152da22fde38b16657e41559350b8bd9cfc674543557f0b811845c597f2d3db56cd46479cb4fbf13536ca90bdd63d956d7c67e0b053c04c52258aeb93fc' +
      '288b0f3a8838c783afa82ce98199f77d83ccee906a6ccefd06ce346c6';

      assert.equal(
        utils.compareAuthenticatingPassword(undefined, volunteer.salt, volunteer.password),
        false,
        'Compare authentication password passed when the salt was not even set');
    });

    it('Should return false if there is no passed in the class', () => {
      const volunteer = new Volunteer();

      volunteer.salt = '5HomjhDxeSNT4H9JmD3iW7h0iUjLyDG7XnKbvQK+QYxN914GExndCEKI5azGaSNSZKcgPrjyxvO04GO/QN6FtRpaTYbOF3D' +
      'AVU9U6i+1VfEMWcvOgb7sUmOb/OI48WRiPgcmatDmPMz89Ih0IspYq/Po+/UOnOMCEmDkfrfhlK8=';

      assert.equal(
        utils.compareAuthenticatingPassword(undefined, volunteer.salt, volunteer.password),
        false, 'Compare authentication password passed when the password was not even set');
    });
  });

  if (_.isNil(process.env.TRAVIS)) {
    describe('#getProfile', () => {
      it('Should return all profile selections', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => {
            const profile = volunteer.getProfile();

            assert.equal(_.isNil(profile.about), false, 'about should be returned from getProfile');
            assert.equal(_.isNil(profile.developer_level), false, 'developer_level should be returned from getProfile');
            assert.equal(_.isNil(profile.email), false, 'email should be returned from getProfile');
            assert.equal(_.isNil(profile.github_id), false, 'github_id should be returned from getProfile');
            assert.equal(_.isNil(profile.linked_in_id), false, 'linked_in_id should be returned from getProfile');
            assert.equal(_.isNil(profile.location), false, 'location should be returned from getProfile');
            assert.equal(_.isNil(profile.name), false, 'name should be returned from getProfile');
            assert.equal(_.isNil(profile.phone), false, 'phone should be returned from getProfile');
            assert.equal(_.isNil(profile.position), false, 'position should be returned from getProfile');
            assert.equal(_.isNil(profile.slack_id), false, 'slack_id should be returned from getProfile');
            assert.equal(_.isNil(profile.timezone), false, 'timezone should be returned from getProfile');
            assert.equal(_.isNil(profile.username), false, 'username should be returned from getProfile');
            assert.equal(_.isNil(profile.verified), false, 'verified should be returned from getProfile');
            assert.equal(_.isNil(profile.volunteer_id), false, 'volunteer_id should be returned from getProfile');
            assert.equal(_.isNil(profile.volunteer_status), false, 'volunteer_status should be returned from getProfile');
          },    (error: Error) => { throw error; });
      });
    });

    describe('#canAccessAdminPortal', () => {
      it('Should return a the set volunteerAdminPortal if its not null or undefined', () => {
        const administrator = new Administrator(null, 'user1');
        administrator.adminPortalAccess = true;

        return administrator.existsByUsername()
        .then(() => administrator.canAccessAdminPortal())
          .then((canAccessAdminPortal: boolean) => {
            assert.equal(canAccessAdminPortal, true, 'Should return true if the adminPortalAccess is already defined');
          },    (error: Error) => { throw error; });
      });

      it('Should return false if the user is lacking the permission to access the admin portal', () => {
        const administrator = new Administrator(null, 'user1');

        return administrator.existsByUsername()
        .then(() => administrator.canAccessAdminPortal())
          .then((canAccessAdminPortal: boolean) => {
            assert.equal(canAccessAdminPortal, false, 'Should return false if the user cannot access the adminPortal');
          },    (error: Error) => { throw error; });
      });

      it('Should return true from the database if the user is able able to access the administration panel', () => {
        const administrator = new Administrator(null, 'user1');

        return administrator.existsByUsername()
        .then(() => administrator.knex('volunteer').update('admin_portal_access', true).where('volunteer_id', administrator.userId))
        .then(() => administrator.canAccessAdminPortal())
        .then((canAccessAdminPortal: boolean) => {
          assert.equal(canAccessAdminPortal, true, 'Should return true if the user can acess the adminPortal');
          return administrator.knex('volunteer').update('admin_portal_access', false).where('volunteer_id', administrator.userId);
        })
        .then(() => assert(true), (error: Error) => { throw error; });
      });

      it('should reject if the userId is null or not passed', () => {
        const administrator = new Administrator();

        administrator.canAccessAdminPortal()
        .then(() => {
          throw new Error('Shouldn\'t resolve when the volunteer id is not passed');
        },    () => assert(true));
      });
    });

    describe('#exists', () => {
      it('Should resolve if the volunteer exists', () => {
        const volunteer = new Volunteer(1);

        return volunteer.existsById()
          .then(() => {
            assert(volunteer.doesExist, 'Volunteer should exist after running existance check');
          },    (error: Error) => { throw error; });
      });

      it('Should reject if the volunteer doesn\'t exists', () => {
        const volunteer = new Volunteer(99999);

        return volunteer.existsById()
          .then(() => {
            throw new Error('Exist shouldn\'t resolve when the volunteer doesn\'t exist');
          },    (error: Error) => {
            assert.equal(
              error.message,
              'User does not exist by id', error.message);
          });
      });

      it('Should reject if the userId is null or undefined', () => {
        const volunteer = new Volunteer();

        return volunteer.existsById()
          .then(() => {
            throw new Error('Shouldn\'t resolve if the project_id is not set');
          },    (error: Error) => {
            assert.equal(
              error.message,
              'userId is null or undefined while attempt to check existence', error.message);
          });
      });

      it('Should resolve when passing something other than the userId', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => assert(true),    (error: Error) => { throw error; });
      });
    });

    describe('#updatePassword', () => {
      it('Should update password for the volunteer if the password is given', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => volunteer.updatePassword('password'))
          .then(() => assert(true), (error: Error) => { throw error; });
      });

      it('Should reject if no password is given', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => volunteer.updatePassword(undefined))
          .then(() => {
            throw new Error('Should not resolve if no password is given');
          },    () => assert(true));
      });

      it('Should reject if the project_id is not a valid string or number', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => {
            volunteer.project_id = null;
            return volunteer.updatePassword(undefined);
          })
          .then(() => {
            throw new Error('Updated password when the project_id was invalid');
          },    () => assert(true));
      });
    });

    describe('#getVerificationCode', () => {
      it('Should resolve a verification code when one exists', () => {
        const volunteer = new Volunteer(1);

        return volunteer.removeVerificationCode()
          .then(() => volunteer.createVerificationCode())
          .then(() => volunteer.getVerificationCode())
          .then((code: IVerificationCode) => {
            assert.equal(!_.isNil(code.code), true, 'Content should contain a code');
            assert.equal(!_.isNil(code.verification_code_id), true, 'verification_code_id should be contained in the code');
            assert.equal(!_.isNil(code.salt), true, 'salt should be contained in the code');
            assert.equal(!_.isNil(code.created_datetime), true, 'created_datetime should be contained in the code');
            volunteer.removeVerificationCode();
          },    (error: Error) => {
            volunteer.removeVerificationCode();
            throw error;
          });
      });

      it('Should resolve a null object if the volunteer does not exist', () => {
        const volunteer = new Volunteer(99999);

        return volunteer.getVerificationCode()
          .then((code) => {
            assert.equal(_.isNil(code), true, 'Code should be a null object if the volunteer does not exist');
          },    (error: Error) => { throw error; });
      });

      it('Should reject if the userId is null or undefined', () => {
        const volunteer = new Volunteer(null);

        return volunteer.getVerificationCode()
          .then(() => {
            throw new Error('Shoudln\'t resolve with a invalid userId');
          },    (error: Error) => {
            assert.equal(error.message, `userId "${volunteer.userId}" passed is not a valid number`, error.message);
          });
      });
    });

    describe('#removeVerificationCode', () => {
      it('Should reject if the userId is not valid', () => {
        const volunteer = new Volunteer();

        return volunteer.removeVerificationCode()
          .then(() => {
            throw new Error('Shouldn\'t resolve when the userId is invalid');
          },    (error: Error) => {
            assert.equal(error.message, `userId "${volunteer.userId}" passed is not a valid number`, error.message);
          });
      });

      it('Should resolve if a verification code exists', () => {
        const volunteer = new Volunteer(1);

        return volunteer.createVerificationCode()
          .then(() => volunteer.removeVerificationCode())
          .then(() => assert(true), (error: Error) => { throw error; });
      });

      it('Should resolve if a verification code does not exist', () => {
        const volunteer = new Volunteer(1);

        return volunteer.createVerificationCode()
          .then(() => volunteer.removeVerificationCode())
          .then(() => assert(true), (error: Error) => { throw error; });
      });
    });

    describe('#createVerificationCode', () => {
      it('Should resolve a verification code', () => {
        const volunteer = new Volunteer(1);

        return volunteer.removeVerificationCode()
          .then(() => volunteer.createVerificationCode())
          .then((code) => {
            volunteer.removeVerificationCode();
            assert.equal(!_.isNil(code), true, 'Code returned should not be null or undefined');
            assert.equal(_.isNumber(code), true, 'Code should be a valid number');
          },    (error: Error) => {
            volunteer.removeVerificationCode();
            throw error;
          });
      });
    });

    describe('#createPasswordResetCode', () => {
      it('Should resolve a password reset code', () => {
        const volunteer = new Volunteer(1);

        return volunteer.removePasswordResetCode()
          .then(() => volunteer.createPasswordResetCode())
          .then((code) => {
            volunteer.removePasswordResetCode();
            assert.equal(!_.isNil(code), true, 'Code returned should not be null or undefined');
            assert.equal(_.isNumber(code), true, 'Code should be a valid number');
          },    (error: Error) => {
            volunteer.removePasswordResetCode();
            throw error;
          });
      });
    });

    describe('#getPasswordResetCode', () => {
      it('Should resolve a verification code when one exists', () => {
        const volunteer = new Volunteer(1);

        return volunteer.removePasswordResetCode()
          .then(() => volunteer.createPasswordResetCode())
          .then(() => volunteer.getPasswordResetCode())
          .then((code: IPasswordResetCode) => {
            volunteer.removePasswordResetCode();
            assert.equal(!_.isNil(code.code), true, 'Content should contain a code');
            assert.equal(!_.isNil(code.password_reset_code_id), true, 'verification_code_id should be contained in the code');
            assert.equal(!_.isNil(code.salt), true, 'salt should be contained in the code');
            assert.equal(!_.isNil(code.created_datetime), true, 'created_datetime should be contained in the code');
          },    (error: Error) => {
            volunteer.removePasswordResetCode();
            throw error;
          });
      });

      it('Should resolve a null object if the volunteer does not exist', () => {
        const volunteer = new Volunteer(99999);

        return volunteer.getPasswordResetCode()
          .then((code) => {
            assert.equal(_.isNil(code), true, 'Code should be a null object if the volunteer does not exist');
          },    (error: Error) => { throw error; });
      });

      it('Should reject if the userId is null or undefined', () => {
        const volunteer = new Volunteer(null);

        return volunteer.getPasswordResetCode()
          .then(() => {
            throw new Error('Shoudln\'t resolve with a invalid userId');
          },    (error: Error) => {
            assert.equal(error.message, `userId "${volunteer.userId}" passed is not a valid number`, error.message);
          });
      });
    });

    describe('#removePasswordResetCode', () => {
      it('Should reject if the userId is not valid', () => {
        const volunteer = new Volunteer();

        return volunteer.removePasswordResetCode()
          .then(() => {
            throw new Error('Shouldn\'t resolve when the userId is invalid');
          },    (error: Error) => {
            assert.equal(error.message, `userId "${volunteer.userId}" passed is not a valid number`, error.message);
          });
      });

      it('Should resolve if a verification code exists', () => {
        const volunteer = new Volunteer(1);

        return volunteer.createPasswordResetCode()
          .then(() => volunteer.removePasswordResetCode())
          .then(() => assert(true), (error: Error) => { throw error; });
      });

      it('Should resolve if a verification code does not exist', () => {
        const volunteer = new Volunteer(1);

        volunteer.createPasswordResetCode()
          .then(() => volunteer.removePasswordResetCode())
          .then(() => assert(true), (error: Error) => { throw error; });
      });
    });

    describe('#doesPasswordResetCodeExist', () => {
      it('Should reject if no password reset code exists', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => volunteer.removePasswordResetCode())
          .then(() => volunteer.doesPasswordResetCodeExist())
          .then(() => {
            throw new Error('Shouldn\'t resolve when no password reset code exists');
          },    (error: Error) => {
            assert.equal(error.message, `No password reset code exists for user ${volunteer.userId}`, error.message);
          });
      });

      it('Should resolve if there is a existing reset code', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => volunteer.createPasswordResetCode())
          .then(() => volunteer.doesPasswordResetCodeExist())
          .then(() => {
            assert(true);
            volunteer.removePasswordResetCode();
          },
                (error: Error) => {
                  volunteer.removePasswordResetCode();
                  throw new Error(`Shouldn't reject when a password reset code exists, error=${error}`);
                });
      });

      it('Should reject if the project_id is invalid', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.doesPasswordResetCodeExist()
          .then(() => {
            throw new Error('Shouldn\'t resolve when a the project_id is invalid');
          },    (error: Error) => {
            assert.equal(error.message, `userId "${volunteer.userId}" passed is not a valid number`, error.message);
          });
      });
    });

    describe('#verify', () => {
      it('Should mark there account and object as verified', () => {
        const volunteer = new Volunteer(1);

        return volunteer.existsById()
          .then(() => volunteer.verifyVolunteer())
          .then(() => volunteer.existsById())
          .then(() => {
            assert.equal(volunteer.verified, true, 'After regathering the acccount, it should be verified');
          },    (error: Error) => { throw error; });
      });

      it('Should reject if the userId is invalid', async () => {
        const volunteer = new Volunteer(null);

        try {
          const verified: boolean = await volunteer.verifyVolunteer();
          assert('shouldn\'t resolve when the userId is invalid');
        } catch (error) {
          assert.equal(error.message, `Cannot verify when userId is null or undefined, userId=${volunteer.userId}`, error.message);
        }
      });
    });

    describe('#create', () => {
      it('Should create the user in the database and create a verification code', () => {
        const volunteer = new Volunteer(null, 'randomvalidusername');

        volunteer.email = 'randomvalidemail@randomvalideamil.co.uk';
        volunteer.name = 'random validname';

        return volunteer.createVolunteer('thepassword')
          .then((verification) => {
            assert.equal(!_.isNil(verification), true, 'Returned verification code cannot be null or undefined');
            return volunteer.existsByUsername();
          })
          .then(() => volunteer.getVerificationCode())
          .then((code) => {
            assert.equal(!_.isNil(code), true, 'After creating the account a verification code should exit');
            return volunteer.removeVerificationCode();
          })
          .then(() => volunteer.knex('volunteer').where('volunteer_id', volunteer.userId).del())
          .then(() => assert(true), (error: Error) => { throw error; });
      });

      it('Should reject if the volunteer name is undefined or null', () => {
        const volunteer = new Volunteer(null, 'randomvalidusername');

        volunteer.email = 'theemail@theemail.com';

        return volunteer.createVolunteer(undefined)
          .then(() => {
            throw new Error('volunteer creation shouldn\'t create the name is not defined.');
          },    (error: Error) => {
            assert.equal(
              error.message,
              `name, username, email and password are required, name=${volunteer.name}, ` +
              `username=${volunteer.username}, email=${volunteer.email}`,
              error.message);
          });
      });

      it('Should reject if the volunteer email is undefined or null', () => {
        const volunteer = new Volunteer(null, 'randomvalidusername');

        volunteer.name = 'the name';

        return volunteer.createVolunteer('thepassword')
          .then(() => {
            throw new Error('volunteer creation shouldn\'t create the name is not defined.');
          },    (error: Error) => {
            assert.equal(
              error.message,
              `name, username, email and password are required, name=${volunteer.name}, ` +
              `username=${volunteer.username}, email=${volunteer.email}`,
              error.message);
          });
      });

      it('Should reject if the volunteer username is undefined or null', () => {
        const volunteer = new Volunteer();

        volunteer.name = 'the name';
        volunteer.email = 'theemail@themail.com';

        return volunteer.createVolunteer('thepassword')
          .then(() => {
            throw new Error('volunteer creation shouldn\'t create the name is not defined.');
          },    (error: Error) => {
            assert.equal(
              error.message,
              `name, username, email and password are required, name=${volunteer.name}, ` +
              `username=${volunteer.username}, email=${volunteer.email}`,
              error.message);
          });
      });

      it('Should reject if the password is not provided', () => {
        const volunteer = new Volunteer(null, 'theusername');

        volunteer.name = 'the name';
        volunteer.email = 'the email';

        return volunteer.createVolunteer(undefined)
          .then(() => {
            throw new Error('Creation shouldn\'t resolve when no password is given');
          },    (error: Error) => {
            assert.equal(error.message, `You must provide a password to create the volunteer=${volunteer.username}`, error.message);
          });
      });
    });

    describe('#doesVerificationCodeExist', () => {
      it('Should reject if no verification code exists', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => volunteer.removeVerificationCode())
          .then(() => volunteer.doesVerificationCodeExist())
          .then(() => {
            throw new Error('Shouldn\'t resolve when no password reset code exists');
          },    (error: Error) => {
            assert.equal(error.message, `No verification code exists for user ${volunteer.userId}`, error.message);
          });
      });

      it('Should resolve if there is a existing verification code code', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => volunteer.createVerificationCode())
          .then(() => volunteer.doesVerificationCodeExist())
          .then(() => {
            assert(true);
            volunteer.removeVerificationCode();
          },    (error: Error) => {
            volunteer.removeVerificationCode();
            throw new Error(`Shouldn't reject when a password reset code exists, error=${error}`);
          });
      });

      it('Should reject if the project_id is invalid', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.doesVerificationCodeExist()
          .then(() => {
            throw new Error('Shouldn\'t resolve when a the project_id is invalid');
          },    (error: Error) => {
            assert.equal(error.message, `userId "${volunteer.userId}" passed is not a valid number`, error.message);
          });
      });
    });

    describe('#getActiveNotifications', () => {
      // TODO: Should first create the notification for the user and then delete it after
      it('Should return all active notifications if notifications exist for the user', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => volunteer.getActiveNotifications())
          .then((notifications: IAnnouncement[]) => {
            assert.equal(!_.isNil(notifications[0]), true, `Notifications should be returned instead of a empty array, ${notifications}`);

            _.forEach(notifications, (notification) => {
              assert.equal(!_.isNil(notification.announcement_id), true, 'Announcement_id should not be undefined or null');
              assert.equal(!_.isNil(notification.data_entry_user_id), true, 'data_entry_user_id should not be undefined or null');
              assert.equal(!_.isNil(notification.title), true, 'title should not be undefined or null');
              assert.equal(!_.isNil(notification.body), true, 'body should not be undefined or null');
              assert.equal(!_.isNil(notification.announcement_type), true, 'announcement_type should not be undefined or null');
              assert.equal(!_.isNil(notification.created_datetime), true, 'created_datetime should not be undefined or null');
              assert.equal(!_.isNil(notification.modified_datetime), true, 'modified_datetime should not be undefined or null');
            });
          },    (error: Error) => {
            throw error;
          });
      });

      it('Should return a empty array if no notifications exist', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.existsByUsername()
          .then(() => volunteer.knex('volunteer_announcement').update('read', true).where('volunteer_id', volunteer.userId))
          .then(() => volunteer.getActiveNotifications())
          .then((notifications: IAnnouncement[]) => {
            assert.equal(_.isNil(notifications[0]), true, `Should return null if there is no notification, notifications=${notifications}`);
            volunteer.knex('volunteer_announcement').update('read', false).where('volunteer_id', volunteer.userId);
          },    (error: Error) => {
            throw error;
          });
      });
    });

    describe('#dismissNotification', () => {
      it('Should return 200 if its marked it as read', () => {
        const volunteer = new Volunteer(null, 'user1');

        const update = () => volunteer.knex('volunteer_announcement').where({
          volunteer_announcement_id: 1,
        }).update({
          read: false,
          read_date: null,
        });

        return volunteer.existsByUsername()
          .then(() => volunteer.dismissNotification(1))
          .then(() => {
            assert(true);
            update();
          },    (error: Error) => {
            update();
            throw error;
          });
      });

      it('Should reject if the volunteer id does not exist', () => {
        const volunteer = new Volunteer(null, 'user1');

        return volunteer.dismissNotification(1)
          .then(() => {
            throw new Error('Dismiss should reject if the volunteer id does not exist');
          },    (error: Error) => {
            assert.equal(error.message, `userId "${volunteer.userId}" passed is not a valid number`, error.message);
          });
      });

      it('should not mark it as read if its not the correct voluteer_id', () => {
        const volunteer = new Volunteer(null, 'user1');
        let totalNotifications: number = 0;
        let olduserId: number = 0;

        return volunteer.existsByUsername()
          .then(() => volunteer.getActiveNotifications())
          .then((notifications: IAnnouncement[]) => {
            totalNotifications = notifications.length;
            olduserId = volunteer.userId;
            volunteer.userId = 99;
            return volunteer.dismissNotification(1);
          })
          .then(() => {
            volunteer.userId = olduserId;
            return volunteer.getActiveNotifications();
          })
          .then((newNotification: IAnnouncement[]) => {
            assert.equal(
              totalNotifications, newNotification.length, 'new Notifications should not change when the userId is not correct');
          },    (error: Error) => {
            throw error;
          });
      });

      it('Should reject if the announcement id is not passed', () => {
        const volunteer = new Volunteer(1, 'user1');

        return volunteer.dismissNotification(null)
          .then(() => {
            throw new Error('Dismiss should reject if the announcement id is not passed');
          },    (error: Error) => {
            assert.equal(error.message, 'Announcement Id must be passed and also a valid number, announcement id=null', error.message);
          });
      });
    });
  }
});
