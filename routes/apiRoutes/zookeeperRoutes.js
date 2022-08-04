const router = require('express').Router();
const {filterByQuery, findById, createNewZookeeper, validateZookeeper} = require('../../lib/zookeepers');
const {zookeepers} = require('../../data/zookeepers.json');

router.get("/zookeepers", (req, res) => {
    let results = zookeepers;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// Get one specific zookeeper as opposed to an array of all the zookeepers that match a query
router.get("/zookeepers/:id", (req, res) => {
    const results = findById(req.param.id, zookeepers);
    if (results) {
        res.json(results);
    } else {
        res.send(404);
    }
})

// Route that accepts data to be used on the server side
router.post('/zookeepers', (req, res) => {
    // Set id based on what the next index of the array will be
    req.body.id =  zookeepers.length.toString();

    // If any data on req.body is incorrect send 400 error
    if(!validateZookeeper(req.body)){
        res.status(400).send('The zookeeper is not properly formatted');
    } else {

        // Add zookeeper to json file and zookeeper array in this function
        const zookeeper = createNewZookeeper(req.body, zookeepers);

        res.json(req.body);
    };
});

module.exports = router;