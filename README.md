# Node.js Pokemon Teams info

## Resource

**Pokemon Teams**

Attributes:
* name ([String])
* sprite ([String])
* types ([String]) *doesnt work
* teamName (String)


## REST Endpoints

Name                               | Method | Path
-----------------------------------|--------|------------------
Retrieve teams collection          | GET    | /teams
Retrieve Individual Team           | GET    | /teams/:id
Retrieve Individual Pokemon        | GET    | /pokemon?name='pokemon name'
Create team member                 | POST   | /teams
Update team member                 | PUT    | /teams/:id
Delete team member                 | DELETE | /teams/:id
