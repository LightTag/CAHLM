import React from 'react'
import {Row,Col} from 'react-bootstrap'
import { MLTButton, ClassifcationButtonsRow } from './classificationButton';
import  "./style.example.css"
export const Example =(props)=>(
    <div className="example">
    <Row>
        <Col md={6} mdOffset={1}>
            <Row>
            {props.example._source.text}
            </Row>
        </Col>
        <Col md={2}>
            <ClassifcationButtonsRow
                example={props.example}
                schema={props.schema}
                submitClassification={props.submitClassification}
            />
        </Col>
        <Col md={2}>
            <MLTButton
                handleSubmit={props.moreLikeThis}
                example={props.example}
            />
        </Col>
    </Row>
    
    </div>
)

export const Examples =  (props)=>(
    <div className="examples">
        {props.hits.map(x=>(
            <Row>
                <Example
                    example={x}
                    schema={props.schema}
                    submitClassification={props.submitClassification}
                    moreLikeThis={props.moreLikeThis}
                />
            </Row>
        )
        )}
        
    </div>
)