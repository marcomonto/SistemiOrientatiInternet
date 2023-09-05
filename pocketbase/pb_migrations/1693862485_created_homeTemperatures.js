/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "opixjyat1csax0k",
    "created": "2023-09-04 21:21:25.696Z",
    "updated": "2023-09-04 21:21:25.696Z",
    "name": "homeTemperatures",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "oyn9sss0",
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
  const collection = dao.findCollectionByNameOrId("opixjyat1csax0k");

  return dao.deleteCollection(collection);
})
