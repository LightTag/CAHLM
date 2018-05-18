import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ESManager } from './containers/esManager';
import {Grid} from 'react-bootstrap'
const schema = [
  {name:"Insult"},{name:"Praise"},{name:"Other"},{name:"Unk"},{name:"Issue"}
]
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div className='App-header' >
          CAHLeM
        </div>

        <Grid fluid>

        <ESManager 
        schema={schema}
        type="email"
        index="enron"
        max_labelers={3}
        //host='http://35.232.140.131:9200'
        host='http://localhost:9200'
        text_field='text' 
         />
        </Grid>
        </React.Fragment>
    );
  }
}

export default App;
