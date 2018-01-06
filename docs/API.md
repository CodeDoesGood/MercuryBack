Notes
-----------------------

All requests go in the standard format of ``` http://site.com/api/{api} ``` I will not be putting this at the start of all the apis in this documentation but instead start from ```{api}```

Available Endpoints
-------------------
Type: ```Get-Request```
  - `/api/project/{{project_id}}`
  - `/api/projects/active`
  - `/api/projects/all`
  - `/api/projects/category/{{category}}`
  - `/api/projects/hidden`
  - `/api/projects/status/{{status}}`
  - `/api/email/service`
  - `/api/email/service/restart`
  - `/api/email/stored`
  - `/api/email/stored/send`
  - `/api/slack/health`
  - `/api/volunteer/password/reset/{{:username/email}}`
  - `/api/volunteer/profile`
  - `/api/volunteer/notification/{{notification_id}}`
  - `/api/volunteer/notifications`
  - `/api/volunteer/verify/{{username}}`

Type: ```Post-Request```
  - `/project/{{project_id}}`
  - `/email/service`
  - `/email/service/password`
  - `/email/stored/{{email_id}}`
  - `/volunteer`
  - `/volunteer/password/reset`
  - `/volunteer/password`
  - `/volunteer/profile`
  - `/volunteer/notification/{{notification_id}}`
  - `/volunteer/notifications`
  - `/volunteer/verify`

Type: ```Delete-Request```
  - `/email/stored/:email_id`
  - `/volunteer`
  - `/volunteer/profile`
  - `/volunteer/notification/:notification_id`
  - `/volunteer/notifications`