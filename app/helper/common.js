const customError = require('../helper/customError');
const {request} = require('express');
const { attachPaginate } = require('knex-paginate');
attachPaginate();

async function paginate(dbConnection, query,queryParameters=[], page= 1,itemsPerPage = 10, closeConnection = false) {

    try {

        page = page < 1 ? 1 : page

        let countQuery = `
            SELECT
                COUNT(*) as numRows
            FROM ( ${query} ) AS DerivedTableAlias
        `;

        let [totalRows] = await dbConnection.execute(countQuery, queryParameters);

        let numRows = totalRows[0].numRows;
        let numPages = Math.ceil(numRows / itemsPerPage);
        let skip = (page-1) * itemsPerPage;
        let limit = skip + ',' + itemsPerPage;
        query = `${query} LIMIT ${limit}`;

        let [rows] = await dbConnection.execute(query, queryParameters);

        if (closeConnection) {
            dbConnection.release();
        }


        return Object({
            items: rows,
            page: page,
            totalPages: numPages,
            totalItems: numRows,
            previous: page > 1 ? page - 1 : false,
            next: page < numPages ? (page + 1) : false,
            links: (req)=> {

                let queries = {};
                let fullUrl = '';
                if (req && req.constructor.name === 'IncomingMessage') {
                    queries = Object.assign({},  req.query);
                    fullUrl = req.protocol + '://' + req.get('host') + req.baseUrl;
                }

                let links = [];

                for (let i = 0; i < numRows; i++) {

                    delete (queries.page);
                    queries['page'] = (i+1);
                    let url = fullUrl;

                    Object.entries(queries).forEach(([key, value], index) => {
                        url += index === 0 ? `?${key}=${value}` : `&${key}=${value}`
                    });

                    links.push(url)

                }

                return links;
            }
    })


    } catch (err) {
        throw new customError(500, err.message);
    }


}

async function _knext (dbConnection) {

    return require('knex')({
        client: 'mysql',
        connection: {
            host : dbConnection.config.host,
            user : dbConnection.config.user,
            password : dbConnection.config.password || '',
            database : dbConnection.config.database
        }
    });

}

module.exports = { _knext};