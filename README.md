# org-hierarchy
Docker + NodeJS exercise

Get the hierarchy of an organization of individuals.

The project has 2 primary interactions:
1) Get the children of a particular user id
2) Update the parent id of a child

Since the project does not come with a database, a dump is provided. 
Further, a POST endpoint exists to add a user name/parent combination which will be added to the local postgres DB.

Persistence is via Postgres database.
The project is meant to function within a docker container, 
though it can be run on nodejs without a container (as long as the host machine has postgres installed)
