const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'heirarchy',
    host: 'localhost',
    database: 'heirarchyapi',
    password: 'g0r6on50la1s74$ty',
    port: 5432,
});

const getAllUsers = (request, response) => {
    pool.query('SELECT * FROM orgchart ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
};

const getAllUsersMain = (callback) => {
    pool.query('SELECT * FROM orgchart ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        callback(results);
    })
};

const getUserById = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM orgchart WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
};

const createUser = (request, response) => {
    console.log(request.body);
    const {name, parent} = request.body;

    pool.query('INSERT INTO orgchart (name, parent) VALUES ($1, $2)', [name, parent], (error, results) => {
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
        'UPDATE orgchart SET name = $1, parent = $2 WHERE id = $3',
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
        'UPDATE orgchart SET parent = $1 WHERE id = $2',
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

    pool.query('DELETE FROM orgchart WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
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