const authenticate = {
  VOLUNTEER:  { link: '/volunteer/authenticate',  method: 'post' },
};

const infrastructure = {
  HELLO: '/infrastructure/hello',
};

const project = {
  GATHER: { link: '/project/:project_id', method: 'get' },
  UPDATE: { link: '/project/:project_id', method: 'post' },
};

const projects = {
  ACTIVE:   { link: '/projects/active',             method: 'get' },
  ALL:      { link: '/projects/all',                method: 'get' },
  CATEGORY: { link: '/projects/category/:category', method: 'get' },
  HIDDEN:   { link: '/projects/hidden',             method: 'get' },
  STATUS:   { link: '/projects/status/:status',     method: 'get' },
};

const email = {
  SERVICE: {
    GET:      { link: '/email/service',                 method: 'get' },
    RESTART:  { link: '/email/service/restart',         method: 'get' },
    UPDATE:   { link: '/email/service',                 method: 'post' },
    UPDATE_PASSWORD: { link: '/email/service/password', method: 'post' },
  },
  STORED: {
    REMOVE:   { link: '/email/stored/:email_id',  method:   'delete'  },
    RETRIEVE: { link: '/email/stored',            method:   'get'     },
    SEND:     { link: '/email/stored/send',       method:   'get'     },
    UPDATE:   { link: '/email/stored/:email_id',  method:   'post'    },
  },
};

const slack = {
  HEALTH: { link: '/slack/health', method: 'get' },
};

const volunteer = {
  CREATE: { link: '/volunteer', method: 'post' },
  REMOVE: { link: '/volunteer', method: 'delete' },

  PASSWORD: {
    REQUEST_RESET:  {  link: '/volunteer/password/reset/:username/:email',  method: 'get' },
    RESET:          {  link: '/volunteer/password/reset',                   method: 'post' },
    UPDATE:         {  link: '/volunteer/password',                         method: 'post' },
  },

  PROFILE: {
    GET:    { link: '/volunteer/profile', method: 'get' },
    REMOVE: { link: '/volunteer/profile', method: 'delete' },
    UPDATE: { link: '/volunteer/profile', method: 'post' },
  },

  NOTIFICATION: {
    DISMISS:  { link: '/volunteer/notification/:notification_id', method: 'delete' },
    GET:      { link: '/volunteer/notification/:notification_id', method: 'get' },
    UPDATE:   { link: '/volunteer/notification/:notification_id', method: 'post' },
  },

  NOTIFICATIONS: {
    DISMISS:  { link: '/volunteer/notifications', method: 'delete' },
    GET:      { link: '/volunteer/notifications', method: 'get' },
    UPDATE:   { link: '/volunteer/notifications', method: 'post' },
  },

  VERIFY: {
    RESEND: { link: '/volunteer/verify/:username', method: 'get' },
    VERIFY: { link: '/volunteer/verify', method: 'post' },
  },
};

export {
  authenticate as auth,
  infrastructure as infra,
  project as proj,
  projects as projs,
  slack,
  email,
  volunteer as vol,
};
