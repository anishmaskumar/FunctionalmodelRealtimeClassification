import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import MyDevices from "./my-devices";

function TabContainer(props) {
  return (
    <Typography component="div">
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  tabsIndicator: {
    background: "#fff"
  }
});

const mapDispatchToProps = ({ devices }) => {
  return {
    ...devices
  };
};

const mapStateToProps = ({ devices }) => {
  return {
    ...devices
  };
};

class Devices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }

  async componentDidMount() {
    await this.props.listDevices();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { classes } = this.props;
    return (
      <main className="main">
        <AppBar position="static" className="tab-header">
          <Tabs
            value={value}
            onChange={this.handleChange}
            classes={{ indicator: classes.tabsIndicator }}
          >
            <Tab label="My Devices" className="tab-nav" />
          </Tabs>
        </AppBar>
        {value === 0 && <MyDevices />}
      </main>
    );
  }
}
Devices.propTypes = {
  classes: PropTypes.object.isRequired
};
export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Devices);
