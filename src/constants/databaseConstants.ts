/**
 * Constants used for having fixed values for when interacting with ENUMS within the database,
 * this will remove any constant mistake that would occur.
 */
interface IProductStatus {
  OFFLINE: number;
  ONLINE: number;
}

interface IProjectHidden {
  HIDDEN: boolean;
  SHOWN: boolean;
}

interface IProductAnnouncementType {
  ERROR: string;
  SUCCESS: string;
}

interface IVolunteerStatus {
  ACTIVE: string;
  LEFT: string;
  OFFLINE: string;
}

interface IAnnouncementStatus {
  SITE: string;
  VOLUNTEER: string;
}

interface IActivityType {
  VOLUNTEER: string;
  PROJECT: string;
  STATUS: string;
}

interface IProductCategory {
  WEB: string;
  IOS: string;
  ANDROID: string;
  LOCAL: string;
  WORLDWIDE: string;
}

interface IRequestStatus {
  COMPLETE: string;
  PROCESSING: string;
}

interface IPlatform {
  WEB: string;
  ANDROID: string;
  IOS: string;
}

interface IDeveloperLevel {
  BASIC: string;
  AVERAGE: string;
  ADVANCED: string;
}

interface IReportVolunteerType {
  SUCCESS: string;
  FAIL: string;
}

interface IReportVolunteerInterest {
  VOLUNTEERING: string;
  DEVELOPING: string;
  DESIGNING: string;
}

interface IDeveloperType {
  WEB: string;
  ANDROID: string;
  IOS: string;
}

interface IJoiningReason {
  VOLUNTEER: string;
  PROGRAMMING: string;
  EXPERIENCE: string;
}

export const requestStatus: IRequestStatus = {
  COMPLETE: 'Complete',
  PROCESSING: 'Processing',
};

export const platform: IPlatform = {
  ANDROID: 'Android',
  IOS: 'Ios',
  WEB: 'Web',
};

export const developerLevel: IDeveloperLevel = {
  ADVANCED: 'Advanced',
  AVERAGE: 'Average',
  BASIC: 'Basic',
};

export const reportVolunteerType: IReportVolunteerType = {
  FAIL: 'Fail',
  SUCCESS: 'Success',
};

export const reportVolunteerInterest: IReportVolunteerInterest = {
  DESIGNING: 'Designing',
  DEVELOPING: 'Developing',
  VOLUNTEERING: 'Volunteering',
};

export const developerType: IDeveloperType = {
  ANDROID: 'Android',
  IOS: 'Ios',
  WEB: 'Web',
};

export const joiningReason: IJoiningReason = {
  EXPERIENCE: 'Experience',
  PROGRAMMING: 'Programming',
  VOLUNTEER: 'Volunteer',
};

export const productAnnouncementType: IProductAnnouncementType = {
  ERROR: 'Error',
  SUCCESS: 'Success',
};

export const projectStatus: IProductStatus = {
  OFFLINE: 2,
  ONLINE: 1,
};

export const projectHidden: IProjectHidden = {
  HIDDEN: true,
  SHOWN: false,
};

export const volunteerStatus: IVolunteerStatus = {
  ACTIVE: 'Active',
  LEFT: 'Left',
  OFFLINE: 'Offline',
};

export const announcementStatus: IAnnouncementStatus = {
  SITE: 'Site',
  VOLUNTEER: 'Volunteer',
};

export const activityType: IActivityType = {
  PROJECT: 'Project',
  STATUS: 'Status',
  VOLUNTEER: 'Volunteer',
};

export const productCategory: IProductCategory = {
  ANDROID: 'Android',
  IOS: 'Ios',
  LOCAL: 'Local',
  WEB: 'Web',
  WORLDWIDE: 'Worldwide',
};
