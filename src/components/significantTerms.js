import React from 'react'
import {Row,Button,Col,Label,ListGroup,ListGroupItem} from 'react-bootstrap'
import './style.sigterm.css'
const SigTermTagButton = (props)=>(
    <Button onClick={()=>{props.selectTag(props.tagname)}}> {props.tagname} </Button>

)

export class SignficantTermsMananager extends React.Component{
    constructor(props){
        super(props)
        this.state = {terms:[]}
    }

    

    selectTag(tagname){
        this.setState({tagname},(x=>{this.props.getSignificantTermsForClass(tagname)}))
    
    }

    moreLikeClass(){

        this.props.moreLikeClass(this.props.terms)
    }

    componentWillUpdate(){
        if (!this.state.updating){
            
        }
    }



    render(){
        return (
        <Row>
            <div className="sigterm-body">
            <Row>
            {this.props.schema.map(tag=>(
                    <SigTermTagButton 
                    tagname={tag.name}
                    selectTag={this.selectTag.bind(this)}
                    
                     />
            ))}
            </Row>
            <Row>
                <Col mdOffset={3}>
                   {this.state.tagname ? <Button bsStyle="success" onClick={this.moreLikeClass.bind(this)} > MORE {this.state.tagname} examples </Button>
                    :null }
                </Col>
            </Row>
            <Row>
                <Col mdOffset={3}>
                {this.props.terms && this.props.terms.length>0 ? 
                    <h2>Feature Words for class {this.state.tagname} </h2>
                    : <h3> Not enough examples for class {this.state.tagname} </h3>}
                </Col>
                    {this.props.terms.map(x=>(
                        <Col md={4}>
                            <span className="sigterm-container">
                                <Button 
                                bsStyle="danger" 
                                bsSize="xsmall"
                                onClick={()=>{this.props.addNullWord(x.key)}}
                                > X </Button> 
                                {/* <Button bsStyle="success" bsSize="xsmall"> V </Button>   */}
                                        {x.key}
                            </span> 
                            </Col>  
                    ))}
            </Row>
        </div>
        </Row>
        )
    }
}