import React from 'react'
import {FormControl, Button} from 'react-bootstrap'
const LabelerNameInput = (props) => {
  let labelerName;
  return (
    <React.Fragment>
      <input type='text'
        type="text"
        placeholder="Enter your name"
        ref={name=>labelerName=name}/>
      <Button onClick={() => {
        props.setName(labelerName.value)
      }}>
        Submit
      </Button>
    </React.Fragment>

  )
}

export const LabelerName = (props) =>{
  if (!props.labelerName){
    return (
      <LabelerNameInput
        setName={props.setName}
        />
    )
  }
  return null 
}