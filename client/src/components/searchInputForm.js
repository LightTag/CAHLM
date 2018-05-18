import React from 'react'
import {Panel} from 'react-bootstrap'
import "./style.searchbar.css"
export const   SearchInput = (props)=>(
  <Panel bsStyle="success" fluid>
    <Panel.Heading>
       <h1>Search for Something </h1>
    </Panel.Heading>
  <Panel.Body>
    <input
      className="search-bar"
      type="text"
      placeholder="Enter text"
      onChange={(e,data)=>{ props.onSubmit(e.target.value)}}
    />
  </Panel.Body>
  </Panel>
)

