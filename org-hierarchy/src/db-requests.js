const mariadb = require('mariadb/callback');
let tableName = 'orgchart';
console.log(process.env);

//const pool = new Pool({connectionString: conString});
/*const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
});  */
const pool = mariadb.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'orghierarchy'
});

const initDB = () => {
    console.log("Trying to create table with " + pool  );

    pool.query("CREATE TABLE IF NOT EXISTS orgchart(id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT, name varchar(80) NOT NULL, parent INTEGER)",
        (error, results) => {
            if (error) {
                console.log("Could not create table " + error);
            } else {
                dbPrimer();
            }
            console.log("Table created");
        }
    );
   
};

const getAllUsers = (request, response) => {

    pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results)
    })
};

const getAllUsersMain = (callback) => {

    //simple check for table/db exist and initialize DB on fail.
    pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {
        if (error) {
            console.log("Initializing db");
            initDB();
            pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`, (error, results) => {
                if (error) {
                    //probably a deeper issue than just the code at this point.
                    throw error
                }
                console.log("Results captured. Ready.");
                callback(results);
            });
        } else {
            callback(results);
        }
    });

};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results)
    })
};

const createUser = (request, response) => {
    const {name, parent} = request.body;

    pool.query(`INSERT INTO ${tableName} (name, parent) VALUES (${name}, ${parent})`, (error, results) => {
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
        `UPDATE ${tableName} SET name = "${name}", parent = ${parent} WHERE id = ${id}`,
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
        `UPDATE ${tableName} SET parent = ${parent} WHERE id = ${id}`,
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

    pool.query(`DELETE FROM ${tableName} WHERE id = ${id}`, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
};

const dbPrimer = () => {
    console.log("No data found. PRIMING... " );
   
    let priming = [["Brayden Kennedy", 0], ["Charles Bryant", 1], ["Dara Redfern", 1], ["Adrian Grey", 2], ["Andrew Jaff", 2],
        ["Christy Attix", 1], ["Corey Watson", 1], ["Jada Green", 3], ["Angela Ripley", 3], ["Ivan Skavan Skivan", 3],
        ["Robert Newton", 8], ["Richard Clarke", 8], ["Todd Marley", 8], ["Marie Dyunsk", 8]];
        priming.forEach(function(entry) {
            pool.query(`INSERT INTO ${tableName} (name, parent) VALUES ("${entry[0]}", ${entry[1]})`,  (error, results) => {
                if (error) {
                    console.log(error);
                    throw error
                }  else {
                    console.log(results);
                }
            })
        });

};


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,

    getAllUsersMain,
    updateParent
};