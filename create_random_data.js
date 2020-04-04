const mongoose = require('mongoose');
const { Spic } = require('./models');
const { url, client_options } = require('./db_conf');
const {
	getNamesGender,
	getLastName,
	getPosition,
	rfc,
	curp,
	getEntity,
	getProcedure,
	getRoles,
	getArea,
	randomChoice
} = require('./sample_data');

let nrows = process.argv[2];

if (typeof nrows === 'undefined' || isNaN(nrows) || nrows < 1) {
	nrows = 200; //default
}

console.log('nrows -> ', nrows);
mongoose.connect(url, client_options);

let data = [];
for (let i = 0; i < nrows; i++) {
	const ng = getNamesGender();
	const ngSuperior = getNamesGender();

	data.push({
		fechaCaptura: new Date().toISOString(),
		ejercicioFiscal: randomChoice([ '2016', '2017', '2018', '2019', '2020' ]),
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
		tipoArea: [ getArea() ],
		tipoProcedimiento: [ getProcedure() ],
		nivelResponsabilidad: [ getRoles() ],
		superiorInmediato: {
			nombres: ngSuperior.name,
			genero: ngSuperior.gender,
			primerApellido: getLastName(),
			segundoApellido: getLastName(),
			curp: '',
			rfc: '',
			puesto: getPosition()
		}
	});
}

data = data.map((d) => {
	d.rfc = rfc(d);
	d.curp = curp(d);
	d.superiorInmediato.rfc = rfc(d.superiorInmediato);
	d.superiorInmediato.curp = curp(d.superiorInmediato);
	return d;
});

Spic.insertMany(data)
	.then((d) => {
		console.log(d);
		mongoose.disconnect();
	})
	.catch((error) => {
		console.log(error);
		mongoose.disconnect();
	});
