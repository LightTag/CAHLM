import React from 'react'
import {Button} from 'react-bootstrap'

export const ClassificationButton =(props)=>(
    <Button
        bsStyle={props.bsStyle}
        onClick={()=>{props.handleSubmit(props.classname,props.example)}}
    > 
        {props.classname} 
    </Button>
)

export const ClassifcationButtonsRow =(props) =>(
    <div className="classification-button-row">
     {props.schema.map((tag,i)=>(
        <ClassificationButton
        key={i} 
        classname={tag.name} 
        handleSubmit={props.submitClassification}
        example={props.example}
        />
    ))}
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