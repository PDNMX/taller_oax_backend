const names = ['Juan', 'Benito', 'Pedro', 'Sergio', 'Fernanda', 'Karla', 'Reyna', 'Isela'];
const last_names = ['Hernandez','Gomez', 'Cruz', 'Perdomo', 'García', 'Mora', 'Morquecho'];

const positions = [
    {
        nombre: 'Director',
        nivel: 'M32'
    },
    {
        nombre: 'Jefe de departamento',
        nivel: 'O21'
    },
    {
        nombre: 'Titular de Unidad',
        nivel: 'J31'
    },
    {
        nombre: 'Director General',
        nivel: 'K31'
    },
    {
        nombre: 'Subdirector',
        nivel: 'N31'
    },
    {
        nombre: 'Director General Adjunto',
        nivel: 'L31'
    }
];

const entities = [
    {
        nombre: "",
        clave: ""
    },
    {
        nombre: "",
        clave: ""
    },
    {
        nombre: "",
        clave: ""
    }
];

const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

const rfc = person => {
    const {primerApellido, segundoApellido, nombres} = person;
    let year = getRandomIntInclusive(1970, 1999);
    let month = getRandomIntInclusive(1, 12);
    let day = getRandomIntInclusive(1,28);

    if (month < 10){
        month = '0' + month;
    }

    if (day < 10){
        day = '0' + day;
    }

    let homoclave = randomChoice(["A","B","C","D","E"]) + getRandomIntInclusive(10, 99);
    let iniciales = primerApellido.slice(0,2).toUpperCase() + segundoApellido[0].toUpperCase() + nombres[0].toUpperCase() ;

  return `${iniciales}${year}${month}${day}${homoclave}`;
};

const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];
const getNames = () => randomChoice(names);
const getLastName = () => randomChoice(last_names);
const getPosition = () => randomChoice(positions);
const getEntity = () => randomChoice(entities);

module.exports = {
    getNames,
    getPosition,
    getLastName,
    rfc,
    getEntity
};