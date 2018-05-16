import React from 'react'
import {FormControl,FormGroup,Button,HelpBlock,ControlLabel} from 'react-bootstrap'
export class SearchInput extends React.Component {
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
            <Button onClick={()=>this.props.onSubmit(this.state.value)}> Submit </Button>
            <FormControl.Feedback />
          </FormGroup>

      );
    }
  }
  
  