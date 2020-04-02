var express = require('express');
var cors = require('cors');
var router = express.Router();
router.use(cors());

// MongoDB
const dbConf = require('../../db_conf');
const mongoose = require('mongoose');
const { Spic } = require('../../models');
const { MongoClient, ObjectID } = require('mongodb');

router.get('/', (req, res) => {
    res.json({
        api_version: 1.0,
        message: "API SLA"
    });
});


// create
router.post('/spic/create', (req, res) => {
    mongoose.connect(dbConf.url, dbConf.client_options);
    const { body } = req;
    let new_spic = Spic(body);

    new_spic.fechaCaptura = (new Date()).toISOString();
    new_spic.save().then(d => {
        console.log(d);
        res.json(d);
        mongoose.disconnect();
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
        mongoose.disconnect();
    });
});

// find by id and update
router.put('/spic', (req, res) => {
    const { id, spic } = req.body;
    mongoose.connect(dbConf.url, dbConf.client_options);

    Spic.findByIdAndUpdate(id, spic, { new: true }).then(sp => {
        res.json(sp);
        mongoose.disconnect();
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
        mongoose.disconnect();
    });
});

// find by id and delete
router.delete('/spic', (req, res) => {
    const { id } = req.body;
    mongoose.connect(dbConf.url, dbConf.client_options);

    Spic.findByIdAndDelete(id).then(d => {
        res.json(d);
        mongoose.disconnect();
    }).catch(error => {
        res.status(500).json(error);
        mongoose.disconnect();
    })
});

// find
// router.get('/spic', (req, res) => {
//     const { body } = req;

//     let {
//         page,
//         pageSize,
//         sort,
//         query
//     } = body;

//     if (typeof pageSize === 'undefined' || isNaN(pageSize) || pageSize < 1 || pageSize > 200) {
//         pageSize = 10
//     }

//     if (typeof page === 'undefined' || isNaN(page) || page < 1) {
//         page = 1;
//     }

//     const params = [
//         "nombres", "primerApellido", "segundoApellido", "curp", "rfc", "institucionDependencia"
//     ];

//     let _query = {};
//     let _sort = {};

//     if (typeof sort !== 'undefined') {
//         const sortFields = ["nombres", "primerApellido", "segundoApellido", "institucionDependencia", "puesto"];
//         sortFields.forEach(p => {
//             if (sort.hasOwnProperty(p) || typeof sort[p] === 'string') {
//                 _sort[p] = sort[p] !== 'asc' ? -1 : 1;
//             }
//         });
//     }

//     if (typeof query !== 'undefined') {
//         params.forEach(p => {
//             if (query.hasOwnProperty(p) || typeof query[p] === "string") {
//                 _query[p] = { $regex: query[p], $options: 'i' };
//             }
//         });

//         if (query.hasOwnProperty('tipoProcedimiento') && Array.isArray(query.tipoProcedimiento) && query.tipoProcedimiento.length > 0) {
//             let or = [];

//             query.tipoProcedimiento.forEach(tp => {
//                 or.push({ tipoProcedimiento: { $elemMatch: { clave: tp } } })
//             });

//             _query.$or = or
//         }
//     }

//     console.log(_query);

//     MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
//         const db = client.db();
//         const spic = db.collection('spic');
//         const skip = page === 1 ? 0 : (page - 1) * pageSize;
//         let cursor = spic.find(_query).skip(skip).limit(pageSize);

//         if (JSON.stringify(_sort) !== '{}') {
//             cursor.sort(_sort);
//         }

//         cursor.count().then(totalRows => {
//             cursor.toArray().then(data => {
//                 let hasNextPage = (page * pageSize) < totalRows;
//                 res.json({
//                     pagination: {
//                         page: page,
//                         pageSize: pageSize,
//                         totalRows: totalRows,
//                         hasNextPage: hasNextPage
//                     },
//                     results: data.map(d => {
//                         let id = d._id.toString();
//                         delete d._id;
//                         return { id: id, ...d };
//                     })

//                 });
//             });
//         });
//     }).catch(err => {
//         res.json({
//             code: "021",
//             message: "fail database"
//         })
//         console.log(err);
//     });
// });

//lista de dependencias
router.get('/spic/dependencias', (req, res) => {
    MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
        const db = client.db();
        const spic = db.collection('spic');


        spic.aggregate([
            { $group: { _id: { nombre: "$institucionDependencia.nombre", siglas: "$institucionDependencia.siglas", clave: "$institucionDependencia.clave" } } }
        ]).toArray(function (err, docs) {
            if (err) {
                res.json({
                    code: "022",
                    message: "fail group"
                })
            }

            res.json(
                docs.map(d => {
                    return d._id;
                })
            )
        });

    }).catch(err => {
        res.json({
            code: "021",
            message: "fail database"
        })
        console.log(err);
    });
});

// api consulta
router.post('/spic', (req, res) => {
    const { body } = req;

    let {
        page,
        pageSize,
        sort,
        query
    } = body;

    if (typeof pageSize === 'undefined' || isNaN(pageSize) || pageSize < 1 || pageSize > 200) {
        pageSize = 10
    }

    if (typeof page === 'undefined' || isNaN(page) || page < 1) {
        page = 1;
    }

    const params = [
        "nombres", "primerApellido", "segundoApellido", "curp", "rfc"
    ];

    let _query = {};
    let _sort = {};

    if (typeof sort !== 'undefined') {
        const sortFields = ["nombres", "primerApellido", "segundoApellido", "puesto", "institucionDependencia"];
        sortFields.forEach(p => {
            if (sort.hasOwnProperty(p) || typeof sort[p] === 'string') {
                _sort[p] = sort[p] !== 'asc' ? -1 : 1;
            }
        });
    }

    if (typeof query !== 'undefined') {
        params.forEach(p => {
            if (query.hasOwnProperty(p) || typeof query[p] === "string") {
                _query[p] = { $regex: query[p], $options: 'i' };
            }
        });

        if (query.hasOwnProperty('tipoProcedimiento') && Array.isArray(query.tipoProcedimiento) && query.tipoProcedimiento.length > 0) {
            let or = [];

            query.tipoProcedimiento.forEach(tp => {
                or.push({ tipoProcedimiento: { $elemMatch: { clave: tp } } })
            });

            _query.$or = or
        }

        if (query.hasOwnProperty('id') && query['id'].length > 0) {
            _query['_id'] = (query['id'].length === 24) ? ObjectID(query['id']) : query['id'];
        }

        if (query.hasOwnProperty('institucionDependencia') && query['institucionDependencia'].length > 0) {
            _query['institucionDependencia.nombre'] = { $regex: query['institucionDependencia'], $options: 'i' };
        }
    }

    console.log(query);
    console.log(_query);

    MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
        const db = client.db();
        const spic = db.collection('spic');
        const skip = page === 1 ? 0 : (page - 1) * pageSize;
        let cursor = spic.find(_query).skip(skip).limit(pageSize).collation({ locale: "en", strength: 1 });

        if (JSON.stringify(_sort) !== '{}') {
            cursor.sort(_sort);
        }

        cursor.count().then(totalRows => {
            cursor.toArray().then(data => {
                //console.log(data);
                let hasNextPage = (page * pageSize) < totalRows;
                // let tR = Math.ceil(totalRows / pageSize) > page;
                res.json({
                    pagination: {
                        pageSize: pageSize,
                        page: page,
                        totalRows: totalRows,
                        hasNextPage: hasNextPage
                    },
                    results: data.map(d => {
                        let id = d._id.toString();
                        delete d._id;
                        return { id: id, ...d };
                    })
                });
            });
        });
    }).catch(err => {
        res.json({
            code: "021",
            message: "fail database"
        })
        console.log(err);
    });
});
module.exports = router;
