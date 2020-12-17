/* eslint-disable */
const schema = require("@colyseus/schema");
const { default: Player } = require("./Player");
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;

export default class StateHandler extends Schema {
  constructor() {
    super();
    this.players = new MapSchema();
  }
}

schema.defineTypes(StateHandler, {
  players: { map: Player }
});
