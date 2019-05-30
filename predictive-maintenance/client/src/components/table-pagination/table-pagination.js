import React, {Component } from "react";
import TablePagination from "@material-ui/core/TablePagination";

class CustomTablePagination extends Component {
    constructor(props){
        super(props);
        this.state = {
        };
    }
    handleChangePage = async (event, page) => {
        await this.props.setParentState({ page, skip : ((page)* this.props.limit) });
        this.props.getListFromParent({skip : this.props.skip, limit : this.props.limit});
    }
    handleChangeRowsPerPage = async (event) => {
        await this.props.setParentState({paginationloading : true});
        var e = event,  page = 0, requiredPage;
        var lastpage = Math.ceil(this.props.totalcount/e.target.value)-1;
        while(page <= lastpage){
          if( (((page+1)*e.target.value) - 1) >= this.props.skip && ((page)*e.target.value) <= this.props.skip)
          {
             requiredPage = page;
          }
          page++;
        }
        await this.props.setParentState({page : requiredPage, skip : (requiredPage*e.target.value), limit: e.target.value });
        await this.props.getListFromParent({skip : this.props.skip, limit : this.props.limit});
        this.props.setParentState({paginationloading : false});
    }
    render(){
        if(!this.props.paginationloading)
        {
        return (
            <TablePagination
            className="tableListPagination"
            rowsPerPageOptions={[3, 5, 10, 15, 25]}
            component="div"
            count={this.props.totalcount}
            rowsPerPage={this.props.limit}
            page={this.props.page}
            backIconButtonProps={{
                "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
                "aria-label": "Next Page",
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
        );
        }
        else
        {
        return null;
        }
    }
}

export default CustomTablePagination;