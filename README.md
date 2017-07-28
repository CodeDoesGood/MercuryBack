# Mercury Volunteer WebApplication

Setup
-----------------------
Make sure to have the nodejs installed. 
```
 npm run install
 npm run test
 npm run start
```

The service will run on port 3000, if you are testing on a phone you will have replace localhost with your machines ip
of what its running on.

Endpoint examples
-----------------------

##Post: localhost:3000/api/projects/all/active


Returns all active projects

```js
{
    "message": "All Active Projects",
    "content": {
        "projects": [
            {
                "id": 1,
                "data_entry_date": "date #1",
                "data_entry_time": "time #1",
                "data_entry_user_id": 1,
                "title": "title #1",
                "status": "active",
                "project_category": 1,
                "hidden": 0,
                "image_directory": "/image/project/project#1.jpeg",
                "summary": "summary #1",
                "description": "description #1"
            },
        ]
    }
}
 ```
 
##Post: localhost:3000/api/authenticate/standard

The authentication call takes in a username and password within the body as json which are both strings, it will return a Object 
that contains a token as a string.

```json
"username": string
"password": string
```

```js
{ 
    message: 'user autenticated'
    content: {
      token: 'string'
    } 
}
 ```
