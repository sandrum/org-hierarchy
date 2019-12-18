const Pool = require('pg').Pool;
var pgtools = require('pgtools');

let tableName = 'orgchart';
let hostname = 'localhost';
let pw = 'g0r6on50la1s74$ty'; //we should probably store these in a .pgp file.
let port = 5432;
let username = 'heirarchy';
let dbname = 'heirarchyapi';

const config = {
    user: username,
    host: hostname,
    password: pw,
    port: port
};

const initDB = () => {
    console.log("Cra gnitdb");
    pgtools.createdb(config, dbname, function (err, res) {
        if (err) {
            console.log("Could not create db " + err);
        }
        pool.query(`CREATE TABLE IF NOT EXISTS orgchart(id INTEGER PRIMARY KEY, name varchar(80) NOT NULL, parent INTEGER)`,
            (error, results) => {
            if (error) {
                console.log("Could not create table " + error);
            } else {
                dbPrimer();
            }
        })

    });
};


const pool = new Pool({
    user: username,
    host: hostname,
    database: dbname,
    password: pw,
    port: port,
});

const getAllUsers = (request, response) => {

    pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
};

const getAllUsersMain = (callback) => {
    //simple check for table/db exist and initialize DB on fail.
    pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {if (error) {initDB();}});
    
    pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {
        if (error) {
            throw error
        }
        callback(results);
    })
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
};

const createUser = (request, response) => {
    const {name, parent} = request.body;

    pool.query(`INSERT INTO ${tableName} (name, parent) VALUES ($1, $2)`, [name, parent], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.id}`)
    })
};


const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const {name, parent} = request.body;

    pool.query(
        `UPDATE ${tableName} SET name = $1, parent = $2 WHERE id = $3`,
        [name, parent, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    )
};

const updateParent = (id, parent, callback) => {

    pool.query(
        `UPDATE ${tableName} SET parent = $1 WHERE id = $2`,
        [parent, id],
        (error, results) => {
            if (error) {
                throw error
            }
            callback(`Successfully modified user ${id} parent to ${parent}`)
        }
    )
};

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
};

const dbPrimer = () => {
    var priming = [["Brayden Kennedy", 0], ["Charles Bryant", 1], ["Dara Redfern", 1], ["Adrian Grey", 2], ["Andrew Jaff", 2],
        ["Christy Attix", 1], ["Corey Watson", 1], ["Jada Green", 3], ["Angela Ripley", 3], ["Ivan Skavan Skivan", 3],
        ["Robert Newton", 8], ["Richard Clarke", 8], ["Todd Marley", 8], ["Marie Dyunsk", 8]];
        priming.forEach(function(entry) {
            pool.query(`INSERT INTO ${tableName} (name, parent) VALUES ($1, $2)`, [entry[0], entry[1]], (error, results) => {
                if (error) {
                    throw error
                }
            })
        });

};

/**
 * concat array
 * @param tpl
 * @param data
 * @returns {Inserter}
 * @constructor
 */
function Inserter(tpl, data) {
    if (!(this instanceof Inserter)) {
        return new Inserter(tpl, data);
    }
    this._rawDBType = true;
    this.formatDBType = function () {
        return data.map(item => '(' + pgp.as.format(tpl, item) + ')').join(',');
    };
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,

    getAllUsersMain,
    updateParent
};