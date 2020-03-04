const {MongoClient} = require('mongodb');
const {url, client_options} = require('./db_conf');
const {getNames, getLastName, getPosition, rfc} = require('./sample_data');

let nrows = process.argv[2];

if (typeof nrows === 'undefined' || isNaN(nrows) || nrows < 1){
    nrows = 200; //default
}

console.log('nrows -> ', nrows);

MongoClient.connect(url, client_options).then(client => {

    let data = [];
    for (let i = 0; i < nrows; i++){
        data.push({
            nombres: getNames(),
            primerApellido: getLastName(),
            segundoApellido: getLastName(),
            puesto: getPosition(),
        });
    }

    data = data.map(d => {
        d.rfc = rfc(d);
        return d;
    });

    const db = client.db();
    const collection = db.collection('spic');

    collection.insertMany(data).then(insertResult => {
       console.log(insertResult);
        client.close();
    }).catch(error => {
        console.log(error);
        client.close();
    });

});
