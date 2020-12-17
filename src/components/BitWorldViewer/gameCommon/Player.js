import Logging from "../../../utils/Logging";

/* eslint-disable */
const schema = require('@colyseus/schema');
const Schema = schema.Schema;

export default class Player extends Schema {
     showAll = () => {
        Logging.Log("called show all");
    }
}

schema.defineTypes(Player, {
    name: "string",
    entityId: "number",
    sessionId: "string",
    x: "number",
    y: "number",
    z: "number",
    heading: "number",
  });
  

  
