const names = [
    {
        name: 'Nancy',
        gender: { clave: 'F', valor: 'FEMENINO' }
    },
    {
        name: 'Fenito',
        gender: { clave: "M", valor: "MASCULINO"}
    },
    {
        name: 'Pedro',
        gender: { clave: "M", valor: "MASCULINO" }
    },
    {
        name: 'Mergio',
        gender: { clave: "M", valor: "MASCULINO" }
    },
    {
        name: 'Fernanda',
        gender: { clave: 'F', valor: 'FEMENINO' }
    },
    {
        name: 'Karla',
        gender: { clave: 'F', valor: 'FEMENINO' }
    },
    {
        name: 'Reyna',
        gender: { clave: 'F', valor: 'FEMENINO' }
    },
    {
        name: 'Ichela',
        gender: { clave: 'F', valor: 'FEMENINO' }
    }
];
const last_names = ['Hernandez','Gomez', 'Cruz', 'Perdomo', 'García', 'Mora', 'Morquecho', 'Caraveo'];

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
        nombre: "Secretaría de la Función Pública",
        clave: "SFP",
        siglas: "SFP"
    },
    {
        nombre: "Secretaría de Hacienda y Crédito Público",
        clave: "SHCP",
        siglas: "SHCP"
    },
    {
        nombre: "Instituto Federal de Telecomunicaciones",
        clave: "IFT",
        siglas: "IFT"
    }
];

const tipoArea = [
    {
        clave: "T",
        valor: "TÉCNICA"
    },
    {
        clave: "RE",
        valor: "RESPONSABLE DE LA EJECUCIÓN"
    }
];

const procedimientos = [
    {
        "clave": 1,
        "valor": "CONTRATACIONES PÚBLICAS"
    },
    {
        "clave": 2,
        "valor": "CONCESIONES, LICENCIAS, PERMISOS, AUTORIZACIONES Y PRÓRROGAS"
    },
    {
        "clave": 3,
        "valor": "ENAJENACIÓN DE BIENES MUEBLES"
    },
    {
        "clave": 4,
        "valor": "ASIGNACIÓN Y EMISIÓN DE DICTÁMENES DE AVALÚOS NACIONALES"
    }
];

const nivelesResponsabilidad = [
    {
        "clave": "A",
        "valor": "ATENCIÓN"
    },
    {
        "clave": "T",
        "valor": "TRAMITACIÓN"
    },
    {
        "clave": "R",
        "valor": "RESOLUCIÓN"
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

const curp = person => {
    const {primerApellido, segundoApellido, nombres, genero} = person;
    let year = getRandomIntInclusive(1970, 1999);
    let month = getRandomIntInclusive(1, 12);
    let day = getRandomIntInclusive(1,28);

    if (month < 10){
        month = '0' + month;
    }

    if (day < 10){
        day = '0' + day;
    }

    let consonants1 = primerApellido.toUpperCase();
    let consonants2 = segundoApellido.toUpperCase();
    let consonants3 = nombres.toUpperCase();
    const vowels = ['A','E','I','O','U'];
    vowels.forEach(v => {
        consonants1 = consonants1.replace(v, '');
        consonants2 = consonants2.replace(v, '');
        consonants3 = consonants3.replace(v, '');
    });

    const consonants = consonants1[1]+ consonants2[1] + consonants3[1];

    const sexo = genero.clave === 'F'?'M':'H';

    let complemento = sexo + randomChoice(["VZ","DF", "OX"])+ consonants + getRandomIntInclusive(10, 99);
    let iniciales = primerApellido.slice(0,2).toUpperCase() + segundoApellido[0].toUpperCase() + nombres[0].toUpperCase() ;

    return `${iniciales}${year}${month}${day}${complemento}`;
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
    curp,
    getEntity
};