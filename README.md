# org-hierarchy
### Docker + NodeJS exercise

##### Get the hierarchy of an organization of individuals.

The project has 2 primary interactions:
1) Get the children of a particular user id
2) Update the parent id of a child

Since the project does not come with a database, a dump is provided. 
Further, a POST endpoint exists to add a user name/parent combination which will be added to the local postgres DB.

Persistence is via Postgres database.
The project is meant to function within a docker container, 
though it can be run on nodejs without a container (as long as the host machine has postgres installed)

How to use:
via command line: 
 ```
  npm start
  ```
via docker: 
 ```
docker image build -t org-hierarchy:1.0 .
 ```    
 ```
docker container run --publish 8000:8080 --detach --name bb org-hierarchy:1.0
 ```
  -----

#### API Commands
Using CURL commands, the following commands are the primary interaction point for the service: 

* Add a user to the hierarchy
* Remove a user from the hierarchy
* Get all descendents of a user
* Update a user's direct report (Parent)
* Get all users
* Get a user by id

-----
Node: the descriptions assume the reachable location of the service is http://localhost:3000. Depending on the
configuration of the service for the user's local installation, this may be different from user to user.
 #### Command Description
 ---

* Add a user to the database/hierarchy
 ```  
POST /users/ 
params: 
name
parent
 ```
 The first user should have a parent set to 0 (they are the root node).  The following is an example of entering a user to the database.

 ```
curl -X POST -i http://localhost:3000/users/ --data 'name=Claire Daines&parent=0'
  ```                           
In this case, Claire Daines has been entered and is the head/leader of the hierarchy.
```
curl -X POST -i http://localhost:3000/users/ --data 'name=LeonardoDiCaprio&parent=1'
  ```
In the above example, Leonardo DiCaprio has been entered and CLaire Daines is his direct report (parent).

 ---

* Remove a user from the database/hierarchy
 ```  
DELETE /users/:id
 ```
 Removing a user with the id of 1 will look like the following.
 ```
curl -X DELETE -i http://localhost:3000/users/1
  ```                           
  ---


* Get Descendants of a User
 ```
GET /user/descendants/$id
```
where $id indicates the id of the user to request descendents from.  
For example, assuming an entity exists in the hierarchy with the id of "6", requesting the descendants of that user would appear as follows:
```
curl -X GET -i http://localhost:3000/user/descendants/6  
``` 
and the response might appear as:
```
[{"_id":4,"_parent":2,"_name":"Adrian Grey","_childlist":[],"_height":3},{"_id":5,"_parent":2,"_name":"Andrew Jaff","_childlist":[],"_height":3},{"_id":13,"_parent":2,"_name":"Marie Dunsk","_childlist":[8],"_height":3},{"_id":8,"_parent":13,"_name":"Jada Green","_childlist":[11,12],"_height":4},{"_id":11,"_parent":8,"_name":"Bob Newton","_childlist":[],"_height":5},{"_id":12,"_parent":8,"_name":"Richard Clarke","_childlist":[],"_height":5}]
```    
 ---

* Update parent id of a user
 ```
 POST /user/updateParent/  
params: 
id
parentId  
```
 where id indicates the id of the user to reparent and parentId is the new parent for the user.  
 
 For example, assuming an entity exists in the hierarchy with the id of "6", and should be parented to user 1, the following would be the syntax
  ```     
 curl -X POST -i http://localhost:3000/user/updateParent/ --data 'id=6&parentId=1'
  ```

If the parent exists, it will be updated. If not, only the user id (if it exists) is updated with the new parent value.  .

 ---
* Get a specific user
```  
GET /users/:id
```
where :id is the user id being requested.  The data returned will be the total data the hierarchy has of the user, including discovered chidlren/subordinates
```  
curl -X GET -i http://localhost:3000/users/12
```
The above in the request for the details of user 12 might appear as the following in the response:
  ```  
 [{"id":12,"name":"Adrian Byrne","parent":1}]
  ```
 ---

* Get All Users
 ```
GET /users
```
No parameters are required to get all user data from the hierarchy list
```
curl -X GET -i http://localhost:3000/users
``` 
and the response might appear as:
 ``` 
[{"id":10,"name":"LeonardoDiCaprio","parent":0},{"id":11,"name":"Claire Daines","parent":1},{"id":12,"name":"Adrian Byrne","parent":1},{"id":13,"name":"Diana Woodring","parent":11}]     
```   

