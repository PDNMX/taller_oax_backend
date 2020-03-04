var express = require('express');
var router = express.Router();

const dbConf = require('../../db_conf');
const {MongoClient, ObjectId} = require('mongodb');

router.get('/', (req, res) => {
   res.json({
       api_version: 1.0,
       message: "API SLA"
   });
});

// create
router.post('/spic', (req, res) => {

    const params = [
        "ejercicioFiscal", "periodoEjercicio", "rfc", "curp",
        "nombres", "primerApellido", "segundoApellido",
        "genero", "institucionDependencia", "puesto", "tipoArea",
        "nivelResponsabilidad", "tipoProcedimiento" /* , superiorInmediato */
    ];

    let servidor_publico = {
        fechaCaptura: (new Date()).toISOString()
    };

    params.forEach(p => {
        if (req.body.hasOwnProperty(p)){
            servidor_publico[p] = req.body[p];
        }
    });

    MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
        const db = client.db();
        const spic = db.collection('spic');
        spic.insertOne(servidor_publico).then(data => {
            //console.log(data);
            res.json({
                insertedId: data.insertedId.toString(),
                ...data.result
            });
        });
    });
});

// find and update by id
router.put('/spic', (req, res) => {
    const {id} = req.body;
    MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
       const db = client.db;
       const spic = db.collection('spic');

       spic.updateOne()
    });
    res.json({});
});

// delete by id
router.delete('/spic', (req, res) => {
    const {id} = req.body;
    MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
        const db = client.db();
        const spic = db.collection('spic');
        spic.deleteOne({_id: ObjectId(id)}).then(data => {
            res.json(data.result)
        });
    });
});

// find
router.get('/spic', (req, res) => {
    const {body} = req;

    let {
        page,
        pageSize
    } = body;

    if (typeof pageSize === 'undefined' || isNaN(pageSize) || pageSize < 1 || pageSize > 200){
        pageSize = 10
    }

    if (typeof page === 'undefined' || isNaN(page) || page < 1){
        page = 1;
    }

    const params = ["nombres", "primerApellido", "segundoApellido"];

    let query = {};

    params.forEach( p => {
        if (body.hasOwnProperty(p)) {
            query[p] = body[p];
        }
    });

    console.log(query);

    MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
        const db = client.db();
        const spic = db.collection('spic');
        let skip = page === 1 ? 0: (page - 1) * pageSize;
        let cursor = spic.find(query).skip(skip).limit(pageSize);

        cursor.count().then( totalRows => {
            cursor.toArray().then(data => {
                //console.log(data);
                res.json({
                    results: data.map(d => {
                        d.id = d._id.toString();
                        delete(d._id);
                        return d;
                    }),
                    pagination: {
                        page: page,
                        pageSize: pageSize,
                        totalRows: totalRows
                    }
                });
            });
        });
    });
});

module.exports = router;
