import * as service from "./service";
import { NotificationManager } from "../../components/notifications";

export default {
  state: {
    deviceData: [],
    device:{},
    devices:{},
    onCreateDeviceSuccess:{}
  },
  reducers: {
    onRequest(state) {
      return {
        ...state,
        loading: true
      };
    },
    onError(state, data) {
      NotificationManager.warn(data.message);
      return {
        ...state,
        loading: false
      };
    },
    onGetDevice(state, data) {
      return {
        ...state,
        loading: false,
        devicedata : data
      };
    },  
    onListDevices(state, devices) {
       return {
         ...state,
         loading: false,
         devices
       };
     },
     onModifyDeviceStatus(state, devices) {
      return {
        ...state,
        loading: false,
        devices
      };
    }
  },
  effects: {
    async getDevice(payload) {
      this.onRequest();
      try {
        let res = await service.getDevice(payload);
        this.onGetDevice(res);
        return res;
      } catch (e) {
        this.onError(e);
      }
    },
    async listDevices(payload) {
       this.onRequest();
       try {
         let res = await service.listDevices(payload);
         this.onListDevices(res);
         return res;
       } catch (e) {
         this.onError(e);
       }
    },
    async modifyDeviceStatus(payload, rootState) {
      var devices = {...rootState.devices.devices};
      console.log("Devices", devices);
      devices.data[0].status = payload.status;
      // this.onRequest();
      try {
        await service.updateDeviceStatus(devices.data[0]._id, payload)
        this.onModifyDeviceStatus(devices);
        return Promise.resolve(devices);
      } catch (e) {
        // this.onError(e);
      }
   },
  }
};
