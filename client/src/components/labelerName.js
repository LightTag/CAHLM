import React from 'react'
import {FormControl} from 'react-bootstrap'
export const LabelerName= (props)=>(
    <FormControl
              type="text"
              placeholder="Enter text"
              onChange={(e,data)=>{ props.setName(e.target.value)}}
            />
)
