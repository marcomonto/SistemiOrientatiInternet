/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "r3y7lr8oe091eoi",
    "created": "2023-09-04 21:19:26.150Z",
    "updated": "2023-09-04 21:19:26.150Z",
    "name": "availableServices",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vudaxul4",
        "name": "address",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "nmlsrinr",
        "name": "type",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("r3y7lr8oe091eoi");

  return dao.deleteCollection(collection);
})
