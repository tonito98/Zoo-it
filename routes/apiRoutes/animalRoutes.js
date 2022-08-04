const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals} = require('../../data/animals');

router.get("/animals", (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//Get one specific animal, rather than an array of all the animals that match a query
router.get('/animals/:id', (req, res) => {
    const results = findById(req.params.id, animals);
    if(results) { 
        res.json(results);
    } else {
        res.send(404);
    }
})

//Route that accepts data to be used on the server side
router.post('/animals', (req, res) => {    
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // If any data in req.body is incorrect, send 400 error 
    if (!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted.');
    } else {

    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);
    
    res.json(req.body);
    }
});

module.exports = router;