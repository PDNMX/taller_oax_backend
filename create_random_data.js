const {MongoClient} = require('mongodb');
const {url, client_options} = require('./db_conf');
const {getNamesGender, getLastName, getPosition, rfc, curp, getEntity, getProcedure, getRoles, getArea, randomChoice} = require('./sample_data');

let nrows = process.argv[2];

if (typeof nrows === 'undefined' || isNaN(nrows) || nrows < 1){
    nrows = 200; //default
}

console.log('nrows -> ', nrows);

MongoClient.connect(url, client_options).then(client => {

    let data = [];
    for (let i = 0; i < nrows; i++){

        const ng = getNamesGender();

        data.push({
            fechaCaptura: (new Date()).toISOString(),
            ejercicioFiscal: randomChoice(['2016','2017','2018','2019','2020']),
            //periodoEjercicio
            //ramo
            rfc: '',
            curp: '',
            nombres: ng.name,
            primerApellido: getLastName(),
            segundoApellido: getLastName(),
            genero: ng.gender,
            institucionDependencia: getEntity(),
            puesto: getPosition(),
            tipoArea: [
                getArea()
            ],
            nivelResponsabilidad: [
                getRoles()
            ],
            tipoProcedimiento: [
                getProcedure()
            ]
            //superiorInmediato
        });
    }

    data = data.map(d => {
        d.rfc = rfc(d);
        d.curp = curp(d);
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
