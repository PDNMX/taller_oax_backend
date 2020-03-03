var express = require('express');
var router = express.Router();

const dbConf = require('./db_conf');
const {MongoClient, ObjectId} = require('mongodb');

router.get('/', (req, res) => {
   res.json({
       api_version: 1.0,
       message: "API SLA"
   });
});

// create
router.put('/spic', (req, res) => {

    const params = [
        "ejercicioFiscal", "periodoEjercicio", "rfc", "curp",
        "nombres", "primerApellido", "segundoApellido",
        "genero", "institucionDependencia", "puesto", "tipoArea",
        "nivelResponsabilidad", "tipoProcedimiento" /* , superiorInmediato */
    ];

    let servidor_publico = {
        fechaCreacion: (new Date()).toISOString()
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
router.post('/spic', (req, res) => {
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
    const {
        page,
        pageSize
    } = req.body;

    const params = ["nombres", "primerApellido", "segundoApellido"];

    let query = {};

    MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
        const db = client.db();
        const spic = db.collection('spic');

        spic.findOne(query).then(data => {
            console.log(data);
            res.json(data);
        });
    });
});

module.exports = router;
