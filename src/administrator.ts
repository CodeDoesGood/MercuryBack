import * as _ from 'lodash';
import { User } from './user';

import { IProject } from './project';

export class Administrator extends User {
  constructor(administratorId?: number, username?: string) {
    super(administratorId, username);
  }

  /**
   * Returns a promsie of the accessability of the current user
   */
  public async canAccessAdminPortal(): Promise<boolean> {
    if (!_.isNil(this.adminPortalAccess)) {
      return Promise.resolve(this.adminPortalAccess);
    }

    return this.knex('volunteer')
      .select('admin_portal_access AS access')
      .where('volunteer_id', this.userId)
      .first()
      .then((res: { access: number }) => {
        this.adminPortalAccess = res.access === 1;
        return Promise.resolve(this.adminPortalAccess);
      })
      .catch((error: Error) => Promise.reject(error));
  }

  /**
   * Creates a new project in the database
   * @param project a project containing all requirements, a IProject interface
   */
  public async createNewProject(project: IProject): Promise<boolean> {
    if (_.isNil(this.adminPortalAccess)) {
      return Promise.reject(`User is not authorised for calling this request, admin_portal_access=${this.adminPortalAccess}`);
    }

    return this.knex('project').insert(project);
  }
}
