const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals.json')


const PORT = process.env.PORT || 3001;
const app = express();

// By providing the file path location of public
// we instruct the server to make these files static.
//So all the front-end code can be accessed without 
// having a specific server endpoint created for it!
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {

    let personalityTraitsArray = [];

    // Note that we save the animalsArray as filteredResults here:

    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animals Array,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// Function that accepts the POST route's req.body
// value and the animalsArray we add data to. In this
// case we add a new animal to the catalog.
function createNewAnimal(body, animalsArray) {
    const animal = body;
    // When we POST a new animal we'll
    // add it to the imported animals array from
    // the animals.json file.
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray}, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

// This validates our new animal data from req.body
// to check that each key exists and is the right type of data.
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

// This reroutes the user to the api root
// app.get('/', (req, res) => {
//     res.redirect('/api/animals');
// });

app.get("/api/animals", (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//Get one specific animal, rather than an array of all the animals that match a query
app.get('/api/animals/:id', (req, res) => {
    const results = findById(req.params.id, animals);
    if(results) { 
        res.json(results);
    } else {
        res.send(404);
    }
})

//Route that accepts data to be used on the server side
app.post('/api/animals', (req, res) => {    
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // If any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.');
    } else {

    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    
    res.json(req.body);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

//Wildcard route in care a client makes a request
// for a non-existent route, they will be rerouted to the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

