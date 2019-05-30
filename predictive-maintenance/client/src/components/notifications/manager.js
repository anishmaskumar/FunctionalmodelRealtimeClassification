import eventEmitter from "./event-emitter";

class Manager {
  info(msg) {
    eventEmitter.emit("notification", msg);
  }
  warn(msg) {
    if (msg === "jwt expired") {
      msg = "Login to access your account";
      eventEmitter.emit("notification", msg);
    } else {
      eventEmitter.emit("notification", msg);
    }
  }
  success(msg) {
    eventEmitter.emit("notification", msg);
  }
}

export default new Manager();
