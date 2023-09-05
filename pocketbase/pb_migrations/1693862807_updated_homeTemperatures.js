/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("opixjyat1csax0k")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "oyn9sss0",
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
  const collection = dao.findCollectionByNameOrId("opixjyat1csax0k")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
