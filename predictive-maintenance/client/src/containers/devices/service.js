import { catchHandler } from "../../helpers/axios";
import config from "../../config";
import client from "../../helpers/feathers";

export function getDevice(payload) {
  return client()
    .service(config.routes.devices)
    .get(payload._id)
    .catch(catchHandler);
}
export function listDevices(payload){
  payload = {query: payload};
  return client()
    .service(config.routes.devices)
    .find(payload)
    .catch(catchHandler);
}
export function updateDeviceStatus(id, payload){
  return client()
    .service(config.routes.devices)
    .patch(id, payload)
    .catch(catchHandler);
}
