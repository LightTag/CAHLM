import React from 'react'
import {Panel, Button} from 'react-bootstrap'
const LabelerNameInput = (props) => {
  let labelerName;
  return (
    <React.Fragment>
      <input type='text'
        className="search-bar"
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
      <Panel>
        <Panel.Heading>
        <h1> Enter your name to start </h1>
        <h2> Don't enter a random string please </h2>
          
        </Panel.Heading>
        <Panel.Body>
          <LabelerNameInput
            setName={props.setName}
            />
        </Panel.Body>
      </Panel>
    )
  }
  return null 
}