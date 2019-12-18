let expect = require("chai").expect;
var httpMocks = require('node-mocks-http');
var expectedParentError = "Parent value is already the same value as requested.";
var expectedParentNonExist = "Could not find either new parent or child to update.";

var testUsers = [{"id": 1, "name": "Brayden Kennedy", "parent": 0}, {
    "id": 2,
    "name": "Charles Bryant",
    "parent": 1
}, {"id": 3, "name": "Dara Redfern", "parent": 1}, {"id": 4, "name": "Adrian Grey", "parent": 2}, {
    "id": 5,
    "name": "Andrew Jaff",
    "parent": 2
}, {"id": 6, "name": "Christy Attucks", "parent": 1}, {"id": 7, "name": "Corey Watson", "parent": 1}, {
    "id": 8,
    "name": "Jada Green",
    "parent": 3
}, {"id": 9, "name": "Angela Rigley", "parent": 3}, {"id": 10, "name": "Ivan Skavan", "parent": 3}, {
    "id": 11,
    "name": "Bob Newton",
    "parent": 8
}, {"id": 12, "name": "Richard Clarke", "parent": 8}, {"id": 13, "name": "Marie Dunsk", "parent": 8}];

let hierarchy = require("../src/hierarchy");

describe("Hierarchy Functionality Test", function () {
    it("Load Hierarchy from disk/cache", function () {
        hierarchy.setpersonnel(testUsers);
        hierarchy.getpersonnel(function (result) {
            expect(result[1].name).equal("Brayden Kennedy");
            expect(result[10].name).equal("Ivan Skavan");
        });
    });
    it("Test initial children of a node", function () {
        hierarchy.setpersonnel(testUsers);
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse();
        req.params.id = 1;
        hierarchy.getAllDescendants(req, res);
        var dataresponse = res._getJSONData();
        expect(dataresponse[0]._name).equal("Charles Bryant");
        expect(dataresponse[4]._name).equal("Adrian Grey");
        expect(dataresponse.length).equal(12);
    });
    it("Test initial children of a node 2", function () {
        hierarchy.setpersonnel(testUsers);
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse();
        req.params.id = 3;
        hierarchy.getAllDescendants(req, res);
        var dataresponse = res._getJSONData();
        expect(dataresponse[4]._name).equal("Richard Clarke");
    });
    it("Test initial children of a childless node", function () {
        hierarchy.setpersonnel(testUsers);
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse();
        req.params.id = 13;
        hierarchy.getAllDescendants(req, res);
        var dataresponse = res._getJSONData();
        expect(dataresponse.length).equal(0);
    });

    it("Set user with id of 13 to have a different parent (1)", function () {
        hierarchy.setpersonnel(testUsers);
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse();
        let answers = {};

        //before call, confirm
        hierarchy.getpersonnel(function(users) {
            expect(users[13].name).equals("Marie Dunsk");
            expect(users[13].parent).equals(8);
        });

        //call to update
        req.body.id = 13;
        req.body.newParentId = 2;
        hierarchy.updateUserParent(req, res);

        //after call, confirm outcome
        hierarchy.getpersonnel(function(users) {
            expect(users[13].name).equals("Marie Dunsk");
            expect(users[13].parent).equals(2);
        });

        //setup child nodes for Marie -- previous manager now reports to Marie
        req.body.id = 8;
        req.body.newParentId = 13;
        hierarchy.updateUserParent(req, res);
        hierarchy.getpersonnel(function(users) {
            answers = users;
            expect(answers[8].name).equals("Jada Green");
            expect(answers[8].parent).equals(13);
            expect(answers[13].name).equals("Marie Dunsk");
        });
    });

    it("Test updating node that already has the same parent specified", function () {
        hierarchy.setpersonnel(testUsers);
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse();
        let answers = {};

        //before call, confirm
        hierarchy.getpersonnel(function(users) {
            answers = users;
            expect(answers[13].name).equals("Marie Dunsk");
            expect(answers[13].parent).equals(8);
        });

        //call to update
        req.body.id = 13;
        req.body.newParentId = 8;
        hierarchy.updateUserParent(req, res);
        var dataresponse = res._getJSONData();
        expect(dataresponse).equals(expectedParentError);
    });

    it("Test updating node that to parent that does not exist", function () {
        hierarchy.setpersonnel(testUsers);
        var req = httpMocks.createRequest();
        var res = httpMocks.createResponse();
        let answers = {};

        //before call, confirm
        hierarchy.getpersonnel(function(users) {
            answers = users;
            expect(answers[13].name).equals("Marie Dunsk");
            expect(answers[13].parent).equals(8);
        });

        //call to update
        req.body.id = 13;
        req.body.newParentId = 118;
        hierarchy.updateUserParent(req, res);
        var dataresponse = res._getJSONData();
        expect(dataresponse).equal(expectedParentNonExist);
    });


});

