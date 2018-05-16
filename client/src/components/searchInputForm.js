import React from 'react'
import {FormControl,FormGroup,Button,HelpBlock,ControlLabel} from 'react-bootstrap'

export const   SearchInput = (props)=>(
  <FormControl
    type="text"
    placeholder="Enter text"
    onChange={(e,data)=>{ props.onSubmit(e.target.value)}}
  />
)

