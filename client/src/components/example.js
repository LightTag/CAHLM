import React from 'react'
import {Row,Col,Panel} from 'react-bootstrap'
import { MLTButton, ClassifcationButtonsRow } from './classificationButton';
import  "./style.example.css"
export const Example =(props)=>(
    <Panel>
        <Panel.Heading>
            <h2> Classify the following example with these classes</h2>
                <ClassifcationButtonsRow
                    example={props.example}
                    schema={props.schema}
                    submitClassification={props.submitClassification}
                />
        </Panel.Heading>
        <Panel.Body>
            <div className="example-text">
                {props.example._source.text}
            </div>
        </Panel.Body>
        <Panel.Footer>
            <h3> Click here to get similar examples </h3>
                    <MLTButton
                        handleSubmit={props.moreLikeThis}
                        example={props.example}
                    />
        </Panel.Footer>

    
    </Panel>
)

export const Examples =  (props)=>{
    const example = props.hits[0]
    if (!example){
        return null;
    }
    return(
    
                <Example
                    example={example}
                    schema={props.schema}
                    submitClassification={props.submitClassification}
                    moreLikeThis={props.moreLikeThis}
                />
        
        
    )
}