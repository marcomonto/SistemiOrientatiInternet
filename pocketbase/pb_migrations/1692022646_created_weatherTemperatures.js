migrate((db) => {
  const collection = new Collection({
    "id": "tj0rjs6ghxq23li",
    "created": "2023-08-14 14:17:26.066Z",
    "updated": "2023-08-14 14:17:26.066Z",
    "name": "weatherTemperatures",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "to5stlc0",
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
  const collection = dao.findCollectionByNameOrId("tj0rjs6ghxq23li");

  return dao.deleteCollection(collection);
})
