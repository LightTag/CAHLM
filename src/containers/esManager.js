import React from 'react'
import elasticsearch from 'elasticsearch'
import {Row,Col} from 'react-bootstrap'
import { SearchInput } from '../components/searchInputForm';
import { Example, Examples } from '../components/example';
import { ClassificationButton, MLTButton } from '../components/classificationButton';
import { SignficantTermsMananager } from '../components/significantTerms';
import { NullWordBar } from '../components/nullWord';
export class ESManager extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            hits:[],
            nullWords:[]
        };
        this.client = new elasticsearch.Client({
            host: this.props.host,
          });


    }
    handleQueryResponse(resp,mlt){
        let hits = [];
        hits = resp.hits.hits
        this.setState({
            hits
        })
    }
    query(qs){

        this.client.search({
            index:this.props.index,
            type:this.props.type,
            body: {
                query: {
                    bool: {
                        must: {
                            query_string:
                                {
                                    query: qs,
                                    fields:["text"]
                                    
                                }
                        },
                        filter:this.makeQueryFilter()
                    },

                }
            }
                 
        })
        .then(this.handleQueryResponse.bind(this))
        .catch(err=>{
            console.error(err)
        })
    }
    makeQueryFilter(){
        let filter = {bool:
                        {
                            must:{
                                range: { 
                                    counter:{
                                        "lt":this.props.max_labelers //No more than 3 votes
                                    }
                                }
                            },
                            must_not:[
                                {"term": {"labelers.keyword":this.props.labeler}}
                            ]
                        },
                        
                            
                        }
                    
        
        if (this.state.nullWords.length >0){
            debugger;
            filter['bool']['must_not'] = filter['bool']['must_not'].concat(this.state.nullWords.map(nt=>{
                let term_query ={
                            term: {}
                    }
                term_query['term'][this.props.text_field] =nt;
                return term_query

                }))
            }        
        return filter
    }

    moreLikeThis(example){
        this.client.search({
            index:this.props.index,
            type:this.props.type,
            body: {
                query: {
                    bool:{

                        must:{
                            more_like_this: {
                                like:{
                                    _index:this.props.index,
                                    _type:this.props.type,
                                    _id:example._id
                                                    
    
                                },

    
                             }
                        },
                        filter:this.makeQueryFilter()
                    }
                }
              }
                 
        })
        .then((resp)=>this.handleQueryResponse(resp,true))
        .catch(err=>{
            console.error(err)
        })

    }

    moreLikeClass(terms){
        //Pass terms from significant terms to get more stuff
        this.client.search({
            index:this.props.index,
            type:this.props.type,
            body: {
                query: {
                    bool:{
                    should: terms.map(x=>{
                        let term_query= {term:{}}
                        term_query['term'][this.props.text_field] =x.key
                        return term_query;     
                    }),
                    filter:this.makeQueryFilter()
                    }
                }
            }
        })
        .then((resp)=>this.handleQueryResponse(resp,true))


    }

    submitClassification(classname,example){
        debugger;
        this.client.update({
            index:this.props.index,
            type:this.props.type,
            id:example._id, // The id of the current example
            body: {
                
                script : {
                    source:`if( ctx._source.containsKey(\"counter\") ){ 
                                ctx._source.counter += 1; 
                                ctx._source.classifications.add(params.classname) ; 
                                ctx._source.labelers.add(params.labeler);
                                
                                } 
                                else { 
                                    ctx._source.counter = 1; 
                                    ctx._source.classifications =[params.classname];
                                    ctx._source.labelers =[params.labeler];
                                    
                                }`,

                    params: {
                        "classname":classname,
                        "labeler":this.props.labeler
                    },
    
            }
        }
            
        })
        .then(resp=>{
            let hits = this.state.hits.filter(x=>x._id !=example._id)
            this.setState({hits})

        })
        .catch(err=>{console.error(err)})
            

    }

    removeNullWord(word){
        let nullWords = this.state.nullWords.filter(x=>x!=word)
        this.setState({nullWords})
    }
    addNullWord(word){
        if (this.state.nullWords.includes(word)){
            return
        }
        else{
            let nullWords = this.state.nullWords
            nullWords.push(word)
            this.setState({nullWords})
        }
        
    }

    render(){
        return(
            <React.Fragment>
        <Row>
            <SearchInput onSubmit={this.query.bind(this)}/>
            <Row>
                    {this.state.hits.length} examples in queue
            </Row>
            <NullWordBar
             words={this.state.nullWords}
             removeWord={this.removeNullWord.bind(this)}
             addWord={this.addNullWord.bind(this)}
             />
        </Row>
        <Row>
            <Col md={3} >
                <SignficantTermsMananager 
                    client={this.client}
                    index={this.props.index}
                    type={this.props.type}
                    schema={this.props.schema}
                    addNullWord={this.addNullWord.bind(this)}
                    moreLikeClass={this.moreLikeClass.bind(this)}
                    />
            </Col>
                
            <Col md={7}>
                <Row>
                        <Examples 
                            hits={this.state.hits}
                            schema={this.props.schema}
                            submitClassification={this.submitClassification.bind(this)}
                            moreLikeThis={this.moreLikeThis.bind(this)}
                        />
                                
                </Row>
            </Col>
        </Row>
        
        </React.Fragment>
        )
    }

}