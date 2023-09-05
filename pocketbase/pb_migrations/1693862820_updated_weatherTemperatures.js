/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6gxe9yy0xtf6u28")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u0h7txxd",
    "name": "value",
    "type": "number",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6gxe9yy0xtf6u28")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
