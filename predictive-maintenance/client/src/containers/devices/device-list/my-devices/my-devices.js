import React, { Component } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

import TableMenu from "./devices-list-menu";
import TablePagination from "../../../../components/table-pagination";
import Loader from "./../../../../components/loader";
import { history } from "../../../../store";

import { connect } from "react-redux";
import { compose } from "recompose";

import socketIOClient from "socket.io-client";
var socket;

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  modal: {
    width: "570px"
  },
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
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

class MyDevices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
      anchorEl: null,
      anchorEl2: null,
      editButton: false,
      open: false,
      rowsPerPage: 5,
      data: {},
      totalcount : 0,
      paginationloading : true,
      skip : 0,
      limit : 5,
      page : 0
    };
  }

  async componentDidMount() {
    // await this.props.listDeviceData();
    // await this.props.listDeviceData(this.props.match.params.list);
    await this.props.listDevices({dtid : this.props.dtid, $skip : 0, $limit : 99999});
    await this.setState({totalcount : this.props.devices.data.length});
    await this.props.listDevices({dtid : this.props.dtid, $skip : this.state.skip, $limit : this.state.limit});
    this.setState({ paginationloading : false });
    socket = socketIOClient("http://localhost:3031");
    socket.emit('message', "helloworld");
    socket.on('message', (status) => {
      console.log("data:", status);
      this.props.modifyDeviceStatus({status});

    });
  }

  // async componentDidUpdate(){
  //   const socket = socketIOClient("http://localhost:3031");
  //   socket.emit('message', "helloworld");
  //   socket.on('message', (status) => {
  //     console.log("update data:", status);
  //     this.props.modifyDeviceStatus({status});
  //     // socket.disconnect();
  //   });
  // }

  componentWillUnmount() {
    socket.disconnect();
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCheckChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
    this.setState({ editButton: true });
  };

  routeChangeEdit() {
    let path = "/devices/1234/563fddf3sds23d13/edit";
    history.push(path);
  }

  routeChangeDetails = (e, _id, innerClick) => {
    if(innerClick)
    {
    e.stopPropagation();
    }
    history.push(
      {
      pathname: `/devices/${_id}/messages`
      }
    );
    // let path = this.props.location + "/" + item._id + "/details";
    // history.push(path);
    // this.setState({open:true});
    //  this.setState({data:item});
  }

  handleDelete = (e, _id) => {
    e.stopPropagation();
    this.props.deleteDevice({_id});
  }

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleIconClick = (event) => {
    this.setState({ anchorEl2: event.currentTarget });
  };

  modalhandleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleIconClose = () => {
    this.setState({ anchorEl2: null });
  };

  stopEventBubbling = (e) => {
    var event = e;
    event.stopPropagation();
  }

  setStates = async (payload) => {
    this.setState(payload);
    return Promise.resolve(true);
  }

  getListAfterAppendingDtid = (payload) => {
    this.props.listDevices({dtid : this.props.dtid, $skip : payload.skip, $limit : payload.limit});
  }

  render() {
    const { classes } = this.props;
    const { loading } = this.props;
    if (loading){ return <Loader />;}

    return (
      <main className="main-wrapper device-type-wrapper">
        <div className="fuild-container">
          <Paper className={classes.root}>
          <div className="block-outer">
          <TableMenu skip={this.state.skip} list={this.props.devices.data}/>
          </div>
          <TablePagination getListFromParent={this.getListAfterAppendingDtid} setParentState={this.setStates} paginationloading={this.state.paginationloading} totalcount={this.state.totalcount} skip={this.state.skip} limit={this.state.limit} page={this.state.page} />
          </Paper>
        </div>
      </main>
    );
  }
}
MyDevices.propTypes = {
  classes: PropTypes.object.isRequired
};
export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MyDevices);
