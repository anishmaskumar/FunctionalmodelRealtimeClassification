import feathers from "@feathersjs/client";
import rest from "@feathersjs/rest-client";
import config from "../config";
import superagent from "superagent";

export default function () {
  let opts = {
    headers: {
      "Content-Type": "application/json",
    }
  };

  const client = feathers();
  return client.configure(rest(config.api.trim()).superagent(superagent, opts));
}
