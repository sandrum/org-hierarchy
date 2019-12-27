const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const db = require('./db-requests');
const hierarchy = require('./hierarchy');
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.get('/', (request, response) => {
    response.json({ info: 'Org-Hierarchy' });
});

//Utility access to allow insertion of users
app.get('/users', db.getAllUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id', db.deleteUser);
app.get('/user/descendants/:id', hierarchy.getAllDescendants);
app.post('/user/updateParent', hierarchy.updateUserParent);


app.listen(port, () => {
    console.log("Waiting for service to start.");
    setTimeout(   function() {
        hierarchy.dbSetup(function() {
            console.log(`Service running on port ${port}.`);
        });
    }, 5000);

});