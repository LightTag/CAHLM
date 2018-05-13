import React from 'react'
import {Label, Button,Col } from 'react-bootstrap'
import {FormControl,FormGroup,HelpBlock,ControlLabel} from 'react-bootstrap'
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
    <h3> <Label bsSize="large" bsStyle="danger">  
    {props.word} 
    <Button bsSize="xsmall" onClick={()=>props.removeWord(props.word)}> X </Button>
    </Label>
    </h3>
)


export const NullWordBar = (props)=>{
    return (
    <div>
        <Col md={2}>
            <WordInputForm onSubmit={props.addWord} />
        </Col>
        {props.words.map(word=>(
            <Col md={1}>
                <NullWord word={word} removeWord={props.removeWord} />
            </Col>
        ))}
    </div>
)
}