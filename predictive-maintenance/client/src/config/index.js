console.log("env : ", process.env.NODE_ENV);
console.log("server : ", process.env.REACT_APP_API_URI);

const server = process.env.REACT_APP_API_URI || "https://api.thingspine.com";

let all = {
  routes : {
    devices: 'devices',
  }
};

let env = {
  development: {
    api: server,
    cookies:{
      name: 'thingspine',
      expiry: 2,
      domain: "localhost"
    }
  },
  staging: {
    api: server,
    cookies: {
      name: 'thingspine',
      expiry: 2,
      domain: ".thingspine.com"
    }
  },
  test: {
    api: server,
    cookies: {
      name: 'thingspine',
      expiry: 2,
      domain: "localhost"
    }
  },
  production: {
    api: server,
    cookies: {
      name: 'thingspine',
      expiry: 2,
      domain: ".thingspine.com"
    }
  }
};

export default {
  ...all,
  ...env[process.env.NODE_ENV]
};
