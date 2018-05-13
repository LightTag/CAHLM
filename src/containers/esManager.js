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
            host: 'http://localhost:9200',
          });
        this.index = 'test'; this.type='test'


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
            index:this.index,
            type:this.type,
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
                                        "lt":3 //No more than 3 votes
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
            filter['bool']['must_not'] = filter['bool']['must_not'].concat(this.state.nullWords.map(nt=>({
                            term: {text:nt}
                    })))

            }
        
        return filter
    }
    moreLikeThis(example){
        this.client.search({
            index:this.index,
            type:this.type,
            body: {
                query: {
                    size:100,
                    bool:{

                        must:{
                            more_like_this: {
                                like:{
                                    _index:this.index,
                                    _type:this.type,
                                    _id:example._id
                                                    
    
                                },
                                filter_duplicate_text: true

    
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
            index:this.index,
            type:this.type,
            body: {
                query: {
                    bool:{
                    should: terms.map(x=>(
                        { term: {text:x.key} })),
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
            index:this.index,
            type:this.type,
            id:example._id, // The id of the current example
            body: {
                
                script : {
                    source:`if( ctx._source.containsKey(\"counter\") ){ 
                                ctx._source.counter += 1; 
                                ctx._source.classifications.add(params.classname) ; 
                                ctx._source.labelers.add(params.labeler)
                                
                                } 
                                else { 
                                    ctx._source.counter = 1; 
                                    ctx._source.classifications =[params.classname]
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
                    index={this.index}
                    type={this.type}
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