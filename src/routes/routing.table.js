const authenticate = {
  VOLUNTEER: '/volunteer/authenticate',
  ADMIN: '/admin/authenticate',
};

const infrastructure = {
  HELLO: '/infrastructure/hello',
};

const project = {
  GATHER: '/project/gather/:project_id',
  UPDATE: '/project/update/:project_id',
};

const projects = {
  ACTIVE: '/projects/all/active',
  ALL: '/projects/all',
  CATEGORY: '/projects/category/:category',
  HIDDEN: '/projects/all/hidden',
  STATUS: '/projects/status/:status',
};

const volunteer = {
  CREATE: '/volunteer/create',

  PASSWORD: {
    RERESET: '/volunteer/password/request_reset',
    RESET: '/volunteer/password/reset',
    UPDATE: '/volunteer/password/update',
  },

  PROFILE: '/volunteer/profile',

  NOTIFICATIONS: {
    DISMISS: '/volunteer/notification/dismiss',
    GET: '/volunteer/notifications',
  },

  VERIFY: {
    VERIFY: '/volunteer/verify',
    RESEND: '/volunteer/verify/:username',
  },
};

module.exports = {
  auth: authenticate,
  infra: infrastructure,
  proj: project,
  projs: projects,
  vol: volunteer,
};
