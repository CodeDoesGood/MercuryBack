import * as _ from 'lodash';
import { User } from './user';

export class Administrator extends User {
  constructor(administratorId?: number, username?: string) {
    super(administratorId, username);
  }

  public async canAccessAdminPortal(): Promise<boolean | Error> {
    if (_.isNil(this.adminPortalAccess)) {
      return this.knex('volunteer').select('admin_portal_access').where('volunteer_id', this.userId).first()
      .then((res: { admin_portal_access: number }) => {
        this.adminPortalAccess = (res.admin_portal_access === 1) ? true : false;
        return Promise.resolve(this.adminPortalAccess);
      })
      .catch((error: Error) => Promise.reject(error));
    }
    return Promise.resolve(this.adminPortalAccess);
  }
}
