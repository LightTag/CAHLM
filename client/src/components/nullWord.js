import React from 'react'
import {Label, Button,Col,Row, Panel } from 'react-bootstrap'
import {FormControl,FormGroup,HelpBlock,ControlLabel} from 'react-bootstrap'
import './style.nullword.css'
class WordInputForm extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleChange = this.handleChange.bind(this);
  
      this.state = {
        value: ''
      };
    }
  
    getValidationState() {
      const length = this.state.value.length;
      if (length > 10) return 'success';
      else if (length > 5) return 'warning';
      else if (length > 0) return 'error';
      return null;
    }
  
    handleChange(e) {
      this.setState({ value: e.target.value });
    }
  
    render() {
      return (
          <FormGroup
            controlId="formBasicText"
            validationState={this.getValidationState()}
          >
            <HelpBlock>Search for something (you can use AND/OR/NOT) </HelpBlock>
          
            <FormControl
              type="text"
              value={this.state.value}
              placeholder="Enter text"
              onChange={this.handleChange}
            />
            <Button onClick={()=>this.props.onSubmit(this.state.value)}> Add </Button>
            <FormControl.Feedback />
          </FormGroup>

      );
    }
  }
const NullWord = (props)=>(
  <span className="null-word" onClick={()=>props.removeWord(props.word)}>
    {props.word} 
    </span>
)


export const NullWordBar = (props)=>{
    return (
    <Panel >
      <Panel.Heading>
        <h2> Filtered Words </h2>
          Examples with these words won't appear
      </Panel.Heading>
      <Panel.Body>
        {/* <Col md={2}>
            <WordInputForm onSubmit={props.addWord} />
        </Col> */}
        <Row className="null-word-container"> 
          {props.words.map(word=>(
                  <NullWord word={word} removeWord={props.removeWord} />
          ))}
      </Row>
    </Panel.Body>
    </Panel>
)
}