migrate((db) => {
  const collection = new Collection({
    "id": "naj81r3cvwl3r5k",
    "created": "2023-08-14 14:17:49.304Z",
    "updated": "2023-08-14 14:17:49.304Z",
    "name": "homeTemperatures",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "svrrcoym",
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
  const collection = dao.findCollectionByNameOrId("naj81r3cvwl3r5k");

  return dao.deleteCollection(collection);
})
