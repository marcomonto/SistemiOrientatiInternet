/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "6gxe9yy0xtf6u28",
    "created": "2023-09-04 21:22:00.413Z",
    "updated": "2023-09-04 21:22:00.413Z",
    "name": "weatherTemperatures",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "u0h7txxd",
        "name": "value",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("6gxe9yy0xtf6u28");

  return dao.deleteCollection(collection);
})
