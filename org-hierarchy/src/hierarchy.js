/**
 * Heirarchy utility
 * @type {{}}
 */

const db = require('./db-requests');
const {Person} = require('./classes/classes');

let personnel = {};

/**
 * Load all users from DB and add to hashtable
 */
db.getAllUsersMain(function (results) {
    //for each row, add person object to hashtable
    //keep track of root person
    let rootNode = new Person();
    var sz = 0;
    results.rows.forEach(function (record) {
        let personObject = new Person();
        personObject.id = record.id;
        personObject.name = record.name;
        personObject.parent = record.parent;
        personnel[record.id] = personObject;
        sz += 1;
        console.log('loaded ' + record.name + ' personnel.');

        if (record.parent === 0) {
            rootNode = personObject;
        }
    });
    console.log('loaded ' + sz + ' personnel.');

    fillSubordinateList();
    //calc Height
    updateHeight(rootNode, 1);

});

fillSubordinateList = () => {
    //for each hashtable entry, update childmap
    Object.keys(personnel).forEach(function (key) {
        let person = personnel[key];
        if (person.parent !== 0) {
            personnel[person.parent].addchild(person._id);
        }
    });
};

/**
 * Update the height of the nodes in the tree
 * @param rootNode
 * @param initHeight
 */
updateHeight = (rootNode, initHeight) => {
    let person = personnel[rootNode.id];
    person.height = initHeight;
    let q = [];
    q[q.length] = person;
    while (q.length > 0) {
        let p = q[0];
        q = q.filter(item => item !== p);
        personnel[p.id].height = p.height;
        p.childlist.forEach(function (child) {
            let childperson = personnel[child];
            childperson.height = p.height + 1;
            q[q.length] = childperson;
        });
    }
};

/**
 * Extract id from request and find all child nodes for the personnel id provided.
 * @param request
 * @param response
 */
getAllDescendants = (request, response) => {
    const id = parseInt(request.params.id);
    let person = personnel[id];

    let chartSet = [];
    let q = [];
    q[q.length] = person;
    while (q.length > 0) {
        let p = q[0];
        console.log('found person with name ' + p.name + ' from list');
        console.log('found subordinates with id ' + p.childlist + ' from list');
        q = q.filter(item => item !== p);
        p.childlist.forEach(function (child) {
            q[q.length] = personnel[child];
            chartSet[chartSet.length] = (personnel[child]);
        });
    }
    response.status(200).json(chartSet)
};

updateUserParent = (request, response) => {
    const id = parseInt(request.params.id);
    const newParentId = parseInt(request.params.parentId);

    let person = personnel[id];
    let newParent = personnel[newParentId];
    if (person === undefined || newParent === undefined) {
        //leaving 200. Request is acceptable in format, simply that at least one entity does not exist.
        response.status(200).json("Could not find either new parent or child to update.");
        return;
    }
    if (person.parent === newParentId) {
        response.status(200).json("Parent value is already the same value as requested.");
        return;
    }
    let oldParent = person.parent;

    //update old parent child list
    if (oldParent !== 0) {
        personnel[oldParent].removeChild(id);
    }
    person.parent = newParentId;
    //update new parent child list
    newParent.addchild(id);
    updateHeight(newParent, newParent.height);

    //update db
    db.updateParent(id, newParentId, function (status) {
        response.status(200).json(status);
    });
};

getpersonnel = (callback) => {
    callback(personnel);
};

setpersonnel = (users) => {
    personnel = {};
    let rootNode;
    users.forEach(function (record) {
        let personObject = new Person();
        personObject.id = record.id;
        personObject.name = record.name;
        personObject.parent = record.parent;
        personnel[record.id] = personObject;
        if (record.parent === 0) {
            rootNode = personObject;
        }
    });
    fillSubordinateList();
    updateHeight(rootNode, 1);
};

module.exports = {
    getAllDescendants,
    updateUserParent,
    //for testing
    getpersonnel,
    setpersonnel
};