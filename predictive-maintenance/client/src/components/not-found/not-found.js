import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { KeyboardArrowLeft } from "@material-ui/icons";

const styles = theme => ({});

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {}
  render() {
    return (
      <main className="main-wrapper m-t-30">
        <div className="container">
          <div className="block-outer bg-block t-center">
            <div className="no-found">
              <div className="item">
                <h1>404</h1>
                <div class="item-content">
                  <h2>The page you requested was not found.</h2>
                  <a href="/device-types/list">
                    <KeyboardArrowLeft />
                    Go Back
                  </a>
                </div>
              </div>
              {/* <p>404 Not Found</p> */}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(NotFound);
