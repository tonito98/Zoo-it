const fs = require("fs");
const {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper,
} = require("../lib/zookeepers");
const {zookeepers} = require("..//data/zookeepers.json");

jest.mock("fs");

test("creates a zookeeper object", () => {
    const zookeeper = createNewZookeeper(
        {name: "Francisca", id:"fppr3"},
        zookeepers
    );

    expect(zookeeper.name).toBe("Francisca");
    expect(zookeeper.id).toBe("fppr3");
});

test("filters by query", () => {
    const startingZookeepers = [
        {
            "id": "8",
            "name": "Lernantino",
            "age": 19,
            "favoriteAnimal": "Business Cat"
          },
          {
            "name": "Les",
            "age": 64,
            "favoriteAnimal": "Rabbit",
            "id": "9"
          },
    ];
    const updatedZookeeper = filterByQuery({favoriteAnimal: "Rabbit"}, startingZookeepers);

    expect(updatedZookeeper.length).toEqual(1);
});

test("find by id", () => {
    const startingZookeepers = [
        {
            "id": "8",
            "name": "Lernantino",
            "age": 19,
            "favoriteAnimal": "Business Cat"
          },
          {
            "name": "Les",
            "age": 64,
            "favoriteAnimal": "Rabbit",
            "id": "9"
          },
    ];

    const result = findById("9", startingZookeepers);

    expect(result.name).toBe("Les");
});

test("validates zookeeper age", () => {
    const zookeeper =  {
        "name": "Les",
        "age": 64,
        "favoriteAnimal": "Rabbit",
        "id": "9"
      };
    
    const invalidZookeeper =  {
        "name": "Les",
        "favoriteAnimal": "Rabbit",
        "id": "9"
      };

      const result = validateZookeeper(zookeeper);
      const result2 = validateZookeeper(invalidZookeeper);

      expect(result).toBe(true);
      expect(result2).toBe(false);
});