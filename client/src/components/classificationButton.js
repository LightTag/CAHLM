import React from 'react'
import {Button,ButtonGroup} from 'react-bootstrap'

export const ClassificationButton =(props)=>(
    <Button
        bsStyle={props.bsStyle}
        onClick={()=>{props.handleSubmit(props.tagName,props.example)}}
    > 
        {props.tagName} 
    </Button>
)

export const ClassifcationButtonsRow =(props) =>(
    <div className="classification-button-row">
    <ButtonGroup>
     {props.schema.map((tag,i)=>(
        <ClassificationButton
        key={i} 
        tagName={tag.name} 
        handleSubmit={props.submitClassification}
        example={props.example}
        />
    ))}
    </ButtonGroup>
    </div>



)


export const MLTButton = (props)=>(
    <div className="mlt-button"> 
    <Button
        bsStyle={props.bsStyle}
        onClick={()=>{props.handleSubmit(props.example)}}
        example={props.example}
    > 
    More Like This
        </Button>
    </div>
)