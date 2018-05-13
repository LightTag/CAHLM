import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ESManager } from './containers/esManager';
import {Grid} from 'react-bootstrap'
const schema = [
  {name:"positive"},{name:"negative"},{name:"neutral"},{name:"brag"},{name:"unk"}
]
class App extends Component {
  render() {
    return (
        <Grid>
        <ESManager schema={schema} labeler="tal2" />
        </Grid>
    );
  }
}

export default App;
