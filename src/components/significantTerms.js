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

    getSignificantTermsForClass(){
        this.props.client.search({
            index:this.props.index,
            type:this.props.type,
            body: {
                query:{
                    term:{ "classifications.keyword":this.state.tagname}
                },
                aggregations : {
                    significant_words : {
                        
                        significant_text : { 
                            "field" : "text",
                            size:100,
                    }
                }
    
            },
        }
    })
    .then(resp=>{
        this.setState({terms:resp.aggregations.significant_words.buckets})
    })
    .catch(err=>console.log(err))

    }

    selectTag(tagname){
        this.setState({tagname},this.getSignificantTermsForClass)
    
    }

    moreLikeClass(){

        this.props.moreLikeClass(this.state.terms)
    }



    render(){
        return (
        <Row>
            <Row>
            {this.props.schema.map(tag=>(
                    <SigTermTagButton 
                    tagname={tag.name}
                    selectTag={this.selectTag.bind(this)}
                    
                     />
            ))}
            </Row>
            <Row>
                <Button onClick={this.moreLikeClass.bind(this)} > MORE </Button>
            </Row>
            <Row>
                <Col md={4}>
                <ListGroup >
                    {this.state.terms.map(x=>(
                        <ListGroupItem > 
                            <span>
                            <Button 
                            bsStyle="danger" 
                            bsSize="xsmall"
                            onClick={()=>{this.props.addNullWord(x.key)}}
                             > X </Button> 
                            <Button bsStyle="success" bsSize="xsmall"> V </Button>  
                                    {x.key}
                                  </span>   
                                 </ListGroupItem>
                    ))}
                    </ListGroup>
                </Col>
            </Row>
        </Row>
        )
    }
}