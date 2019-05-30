import React, { Component } from "react";

import Loader from "../components/loader";
import { Helmet } from "react-helmet";

export default function asyncComponent(importComponent) {
  class AsyncFunc extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null
      };
    }
    // componentDidMount() {}
    componentWillUnmount() {
      this.mounted = false;
    }
    async componentDidMount() {
      this.mounted = true;
      const { default: Component } = await importComponent();
      if (this.mounted) {
        this.setState({
          component: <Component {...this.props} />
        });
      }
    }

    render() {
      const Component = this.state.component || <Loader />;
      // return Component;
      if (this.props.settings && this.props.settings.title) {
        return (
          <div>
            {Component}
            <Helmet>
              <title>{this.props.settings.title} :: Thingspine</title>
            </Helmet>
          </div>
        );
      } else {
        return Component;
      }
    }
  }

  return AsyncFunc;
}
