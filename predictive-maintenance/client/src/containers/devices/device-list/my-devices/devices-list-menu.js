import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Threedotmenu from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";

class DevicesListMenu extends Component{
    constructor(props){
        super(props);
        this.state = {
          checkbox : [],
          checkedAll : false
        };
    }
    componentDidMount() {
      var checkbox = [];
      if(this.props.list)
      {
      for(let i=0; i<this.props.list.length; i++)
      {
        checkbox[i] = {no : i, checked : false, _id : this.props.list[i]._id};
      }
      }
      this.setState({checkbox});
    }
    handleClose = (e) => {
        if(e != null)
        {
        e.stopPropagation();
        }
        this.setState({ anchorEl: null });
    }
    handleThreedotMenu = (event, i) => {
        var e = event;
        e.stopPropagation();
        this.setState({ anchorEl: e.currentTarget , menuIdentifier : i});
    };
    handleDeleteItems = (e, checkboxno) => {
      var checkbox = [...this.state.checkbox], checkedAll = true, elementFound = false, event = e;
      if(checkbox.length !== 0)
      {
        for(let i=0;i<checkbox.length;i++)
        {
          if(checkbox[i].no === checkboxno)
            {
              elementFound = true;
              checkbox.splice(i, 1, {no : checkboxno, checked : event.target.checked, _id : this.props.list[checkboxno]._id });              
              break;
            }
        }
      }
      if(checkbox.length === 0 || !elementFound)
      {
        checkbox.push({no : checkboxno, checked : event.target.checked, _id : this.props.list[checkboxno]._id });
      }
      for(let i=0; i<checkbox.length; i++)
      {
        if(!checkbox[i].checked)
        {
          checkedAll = false;
          break;
        }
      }
      this.setState({checkbox, checkedAll});
    }
    handleMultipleDelete = async (e) => {
      if(window.confirm("Confirm deletion"))
      {
      var checkbox = [...this.state.checkbox], deleteList = [];
      for(let i=0; i<checkbox.length; i++)
      {
        if(checkbox[i].checked)
        {
          deleteList.push(checkbox[i]._id);
        }
      }
      for(let i=0;i<deleteList.length;i++)
      {
      await this.props.deleteListItems({_id : deleteList[i]});
      }
      var newcheckbox = checkbox.filter((data) => {
        return !data.checked;
      });
      for(let i=0; i<newcheckbox.length; i++)
      {
        newcheckbox[i].no = i;
      }
      this.setState({checkbox : newcheckbox, checkedAll : false});
    }
    }
    isdeleteListOccupied = () => {
      var checkbox = [...this.state.checkbox], elementFound = false;
      for(let i=0; i<checkbox.length; i++)
      {
        if(checkbox[i].checked)
        {
          elementFound = true;
          break;
        }
      }
      return elementFound;
    }
    selectAllForDeletion = async (e) => {
      var checkbox = [], event = e;
      for(let i=0; i<this.props.list.length; i++)
      {
      checkbox[i] = {no : i, checked : event.target.checked, _id : this.props.list[i]._id};
      }
      await this.setState({checkbox, checkedAll : event.target.checked});
    }
    renderList = () => {
        var list = [];
        if(this.props.list)
        {
        for (let i=0; i<this.props.list.length; i++)
        {
          list[i] = ( 
          <TableRow key={(this.props.skip + i)} onClick={(e) => {}}>
            <TableCell>
              { 
              <Checkbox  className="check-item"
              checked={this.state.checkbox[i] ? this.state.checkbox[i].checked : false}
              onClick={(e) => {e.stopPropagation();}}
              onChange={(e) => {this.handleDeleteItems(e, i);}}
              value={i}
              color="primary"
              />
              }
            </TableCell>
            <TableCell
              padding="dense"
              component="td"
              scope="row"
            >
              {this.props.list[i]._id}
            </TableCell>
            {/* <TableCell
              padding="dense"
              component="td"
              scope="row"
            >
              {this.props.list[i].vdid}
            </TableCell>
            <TableCell
              padding="dense"
              component="td"
              scope="row"
            >
              {new Date(this.props.list[i].createdAt).toDateString()}
            </TableCell>
            <TableCell
              padding="dense"
              component="td"
              scope="row"
            >
              Inactive (rest)
            </TableCell> */}
            {/* <TableCell
              padding="dense"
              component="td"
              scope="row"
            >
              {new Date(this.props.list[i].updatedAt).toDateString()}
            </TableCell> */}
            {/* <TableCell
              padding="dense"
              component="td"
              scope="row"
            >
              {this.props.list[i].token}
            </TableCell> */}
            {/* <TableCell>
              {
                <div key={i}>
                  <Button onClick={(e) => {this.handleThreedotMenu(e, i);}}>
                    <Threedotmenu />
                  </Button>
                </div>
              }
            </TableCell> */}
            <TableCell
              padding="dense"
              component="td"
              scope="row"
            >
              {this.props.list[i].status}
            </TableCell>
            <TableCell component="td" scope="row"></TableCell>
          </TableRow>
          );
        }
        }
        return list;
      }

    render(){
        return (
            <Table className="table">
            <TableHead className="tabel-head">
              <TableRow>
                <TableCell>
                  <Checkbox className="check-item"
                  checked={this.state.checkedAll}
                  onClick={(e) => {e.stopPropagation();}}
                  onChange={this.selectAllForDeletion}
                  value={null}
                  color="primary"
                  />
                </TableCell>
                <TableCell padding="dense">BOTTLES</TableCell>
                {/* <TableCell padding="dense">VENDOR DEVICE ID</TableCell>
                <TableCell padding="dense">CREATED</TableCell>
                <TableCell padding="dense">CONNECTION STATUS</TableCell> */}
                {/* <TableCell padding="dense">LAST CONNECTED</TableCell> */}
                {/* <TableCell padding="dense">TOKEN</TableCell> */}
                {/* <TableCell>
                  { this.isdeleteListOccupied() &&
                  <IconButton className="delete-btn" onClick={(e) => {this.handleMultipleDelete(e);}}
                  >
                  <DeleteIcon />
                  </IconButton>
                  }
                </TableCell> */}
                <TableCell padding="dense">STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { 
              this.renderList()
              }
              <Menu
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}>
                <MenuItem onClick={(e) => {}}>Edit</MenuItem>
                <MenuItem onClick={(e) => {window.confirm("Confirm deletion?")}}>Delete</MenuItem>
              </Menu>
            </TableBody>
          </Table>
        );
    }
}

export default DevicesListMenu;