var express = require('express');
var cors = require('cors');
var router = express.Router();
router.use(cors());

// MongoDB
const dbConf = require('../../db_conf');
const mongoose = require('mongoose');
const {Spic} = require('../../models');
const {MongoClient, ObjectId} = require('mongodb');

router.get('/', (req, res) => {
   res.json({
       api_version: 1.0,
       message: "API SLA"
   });
});


// create
router.post('/spic', (req, res) => {
    mongoose.connect(dbConf.url, dbConf.client_options);
    const {body} = req;
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

// find and update by id
router.put('/spic', (req, res) => {
    const {id, spic} = req.body;
    mongoose.connect(dbConf.url, dbConf.client_options);

    Spic.findByIdAndUpdate(id, spic, {new: true}).then(sp => {
        res.json(sp);
        mongoose.disconnect();
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
        mongoose.disconnect();
    });
});

// delete by id
router.delete('/spic', (req, res) => {
    const {id} = req.body;
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
