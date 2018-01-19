import * as _ from 'lodash';
import { User } from './user';

import { IProject, Project } from './project';

export class Administrator extends User {
  constructor(administratorId?: number, username?: string) {
    super(administratorId, username);
  }

  /**
   * checkes to see if the administrator has a valid admin_portal_access within the database
   */
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

  /**
   * Creates a new project in the database
   * @param project a project containing all requirements, a IProject interface
   */
  public async createNewProject(project: IProject): Promise<boolean> {
    if (_.isNil(this.adminPortalAccess)) {
      return Promise.reject(`User is not authorsised for calling this request, admin_protal_acces=${this.adminPortalAccess}`);
    }

    return this.knex('project').insert(project);
  }
}
