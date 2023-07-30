migrate((db) => {
  const collection = new Collection({
    "id": "95p3ql5vzto4q0y",
    "created": "2023-07-30 17:48:33.766Z",
    "updated": "2023-07-30 17:48:33.766Z",
    "name": "temperatures",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "8maax0wp",
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
  const collection = dao.findCollectionByNameOrId("95p3ql5vzto4q0y");

  return dao.deleteCollection(collection);
})
