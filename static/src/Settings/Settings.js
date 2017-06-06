/**
 * Component: Settings
 * Purpose: Configuration and Validation of yaml file.
 * Properties:
 *  data: Data object from API request
 **/

//React and React Bootstrap imports
import React, {Component, Text} from 'react';
import {
  Col,
  Row,
  ControlLabel,
  FormControl,
  Grid,
  Panel,
  Well,
  Button,
} from 'react-bootstrap';
import axios from 'axios';
import Navbar from '../Navbar/Navbar.js';
import Footer from '../Dashboard/Footer/Footer.js';

class Settings extends Component {
  constructor () {
    super ();
    this.state = {
      data: [],
    };
  }

  componentDidMount () {
    var _this = this;

    axios
      .get ('/garnet/settings')
      .then (function (response) {
        var data = response.data;
        console.log (data);
        _this.setState ({
          data: response.data,
        });
      })
      .catch (function (error) {
        console.log (error);
      });
  }

  render () {
    return (
      <div>
        <Navbar />

        <form className="container">
          <Grid>
            <Row className="show-grid">
              <Well>

                <ControlLabel>Log File</ControlLabel>
                <FormControl
                  type="text"
                  value=""
                  placeholder={this.state.data.log_file}
                />

                <ControlLabel>Log Level</ControlLabel>
                <FormControl componentClass="select" placeholder="select">
                  <option value="">info</option>
                </FormControl>

                <ControlLabel>agent_cache_directory</ControlLabel>
                <FormControl
                  type="text"
                  value=""
                  placeholder={this.state.data.agent_cache_directory}
                />

                <ControlLabel>language</ControlLabel>
                <FormControl componentClass="select" placeholder="select">
                  <option value="other">en</option>
                </FormControl>

                <ControlLabel>interval</ControlLabel>
                <FormControl
                  type="text"
                  value=""
                  placeholder={this.state.data.interval}
                />

                <ControlLabel>agent_subprocesses</ControlLabel>
                <FormControl
                  type="text"
                  value=""
                  placeholder={this.state.data.agent_subprocesses}
                />

                <ControlLabel>listen_address</ControlLabel>
                <FormControl
                  type="text"
                  value=""
                  placeholder={this.state.data.listen_address}
                />

                <ControlLabel>bind_port</ControlLabel>
                <FormControl
                  type="text"
                  value=""
                  placeholder={this.state.data.bind_port}
                />
              </Well>
            </Row>
          </Grid>
        </form>

        <Col xs={8} xsOffset={2}>
          <Button
            bsStyle="success"
            bsSize="large"
            block
            style={{marginBottom: '30px'}}
          >
            Save
          </Button>
        </Col>

        <Footer />
      </div>
    );
  }
}

//Default properties
Settings.defaultProps = {
  data: [],
};

//Exports class to Global namespace
export default Settings;
