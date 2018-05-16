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
        <div className="sigterm-body">
            
                <Col mdOffset={1} md={11}>
                {this.props.schema.map(tag=>(
                        <SigTermTagButton 
                        tagname={tag.name}
                        selectTag={this.selectTag.bind(this)}
                        
                        />
                ))}
            </Col>
            <Row>
                <Col mdOffset={3}>
                   {this.state.tagname ? <Button bsStyle="success" onClick={this.moreLikeClass.bind(this)} > MORE {this.state.tagname} examples </Button>
                    :null }
                </Col>
            </Row>
            <Row>
                <Col mdOffset={1}>
                <div className="sigterms-status">
                {this.props.terms && this.props.terms.length>0 ? 
                    <i>Feature Words for class {this.state.tagname} </i>
                    : <h3> Not enough examples for class {this.state.tagname} </h3>}
                </div>
                </Col>
                    {this.props.terms.map(x=>(
                        <Col md={4}>
                            <span className="sigterm-container" onClick={()=>{this.props.addNullWord(x.key)}}>
                                        {x.key}
                            </span> 
                            </Col>  
                    ))}
            </Row>
        </div>
        )
    }
}