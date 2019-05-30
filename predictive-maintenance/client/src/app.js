import React, { Component } from "react";
import { Provider } from "react-redux";
import { store, history } from "./store";
import Routes from "./router";
import Theme from "./theme";
import { NotificationContainer } from "./components/notifications";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Theme>
          <Routes history={history} />
          <NotificationContainer />
        </Theme>
      </Provider>
    );
  }
}

export default App;
