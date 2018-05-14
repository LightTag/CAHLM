import React from 'react'
import {Label, Button,Col,Row } from 'react-bootstrap'
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
  <span className="null-word">
    {props.word} 
    <Button bsSize="xsmall" onClick={()=>props.removeWord(props.word)}> X </Button>
    </span>
)


export const NullWordBar = (props)=>{
    return (
    <Row >
        {/* <Col md={2}>
            <WordInputForm onSubmit={props.addWord} />
        </Col> */}
        <div className='null-word-bar'>
          {props.words.map(word=>(
                  <NullWord word={word} removeWord={props.removeWord} />
          ))}
        </div>
    </Row>
)
}