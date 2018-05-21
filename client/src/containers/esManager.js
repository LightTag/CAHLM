import React from 'react'
import elasticsearch from 'elasticsearch'
import {Row, Col} from 'react-bootstrap'
import {SearchInput} from '../components/searchInputForm';
import {Example, Examples} from '../components/example';
import {ClassificationButton, MLTButton} from '../components/classificationButton';
import {SignficantTermsMananager} from '../components/significantTerms';
import {NullWordBar} from '../components/nullWord';
import {LabelerName} from '../components/labelerName';
import './manager.css'
export class ESManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      nullWords: [],
      terms: [],
    };
    this.client = new elasticsearch.Client({host: this.props.host});

  }
  componentDidMount() {
    this.query("*")
  }
  handleQueryResponse(resp, mlt) {
    let hits = [];
    hits = resp.hits.hits
    this.setState({hits})
  }
  setLabeler(name) {
    this.setState({labeler: name})
  }

  query(qs) {

    this
      .client
      .search({
        index: this.props.index,
        type: this.props.type,
        body: {
          query: {
            bool: {
              must: {
                query_string: {
                  query: qs,
                  fields: [this.props.text_field]

                }
              },
              filter: this.makeQueryFilter()
            }
          }
        }

      })
      .then(this.handleQueryResponse.bind(this))
      .catch(err => {
        console.error(err)
      })
  }
  makeQueryFilter() {
    /*
        Common filters we use on all queries. Ensure that no more than max_labelers have already
        labeled this data and that the labeler using the client has not seen this data

        */
    let filter = {
      bool: {
        should: [
          // ES version of OR. Either the counter is NULL or less than max_labelers have
          // seen this example
          {
            range: {
              counter: {
                "lt": this.props.max_labelers //No more than 3 votes
              }

            }
          }, {
            bool: {
              must_not: {
                exists: {
                  field: "counter"
                }
              }
            }
          }
        ],
        must_not: [//The current labeler has not seen the example
          {
            "term": {
              "labelers.keyword": this.state.labeler
            }
          }
        ]
      }
    }

    if (this.state.nullWords.length > 0) {
        // If there are words that the user has decided to block we add them to the filter
        // Doing it here means we only do it once + ES doesn't give a score for it
      debugger;
      filter['bool']['must_not'] = filter['bool']['must_not'].concat(this.state.nullWords.map(nt => {
        let term_query = {
          term: {}
        }
        term_query['term'][this.props.text_field] = nt;
        return term_query

      }))
    }
    return filter
  }

  moreLikeThis(example) {
      /* Given an example, run elasticsearch more like this query to return similar documents
      */
    this
      .client
      .search({
        index: this.props.index,
        type: this.props.type,
        body: {
          query: {
            bool: {

              must: {
                more_like_this: {
                  like: {
                    _index: this.props.index,
                    _type: this.props.type,
                    _id: example._id

                  }
                }
              },
              filter: this.makeQueryFilter()
            }
          }
        }

      })
      .then((resp) => this.handleQueryResponse(resp, true))
      .catch(err => {
        console.error(err)
      })

  }

  moreLikeClass(terms) {
    /*
        Given a list of terms, documents containing those terms. 
        We use this to get documents with significant terms for a particular class,
        e.g. run a significant terms query based on the documents class, and then query for all
        documents containing those significant terms
    */
    this
      .client
      .search({
        index: this.props.index,
        type: this.props.type,
        body: {
          query: {
            bool: {
              should: terms.map(x => {
                  //Ugly trick to dynamically assign to a key of an object (text_fied)
                let term_query = {
                  term: {}
                }
                term_query['term'][this.props.text_field] = x.key
                return term_query;
              }),
              filter: this.makeQueryFilter()
            }
          }
        }
      })
      .then((resp) => this.handleQueryResponse(resp, true))

  }

  submitClassification(classname, example) {
    /*
        When the user assigns a class we submit to ES. A few things need to happen on the ES side, which we handle
        through a script. 
        We check if a counter field exists. If not we create it with value 1, and add a field labalers and classname
        each an array of string. 
        Labelers stores who labeled this already and classname stores the name of the class we assigned to the example
    */
    this
      .client
      .update({
        index: this.props.index, type: this.props.type, id: example._id, // The id of the current example
        body: {

          script: {
            source: `if( ctx._source.containsKey(\"counter\") ){ 
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
              "classname": classname,
              "labeler": this.state.labeler
            }
          }
        }

      })
      .then(resp => {
          // Remove the example we submittmed from the queue of examples to be classified
        let hits = this
          .state
          .hits
          .filter(x => x._id != example._id)
        this.setState({hits})

      })
      .catch(err => {
        console.error(err)
      })

  }

  removeNullWord(word) {
      // Remove a null word from the list of nullwords
    let nullWords = this
      .state
      .nullWords
      .filter(x => x != word)
    this.setState({nullWords})
  }
  addNullWord(word) {
      //Add a null word to the list of null words
    if (this.state.nullWords.includes(word)) {
      return
    } else {
      let nullWords = this.state.nullWords
      nullWords.push(word)
      this.setState({nullWords})
    }

  }

  getSignificantTermsForClass(tagname) {
    /* 
        Runs a signficant terms query in ES based on a classname.
        Basically, we tell ES to get the documents that are labeled with that classname and see which words
        are very frequent in them but not frequent in the rest of the corpus. 
    
    */
    this.setState({updating: true})
    this
      .client
      .search({
        index: this.props.index,
        type: this.props.type,
        body: {
          query: {
            term: {
              "classifications.keyword": tagname // get documents with those terms
            }
          },
          aggregations: {
            significant_words: {

              significant_text: {
                "field": this.props.text_field, // Only check the text_field
                size: 20, // Bring back 10 words
                "min_doc_count": 3, // Magic number, ensure that a term appears in at least three docs. 
                // the min_doc is a nasty but effective way not to overfit on junk terms
                "filter_duplicate_text": true


              }
            }

          }
        }
      })
      .then(resp => {

        this.setState({terms: resp.aggregations.significant_words.buckets, updating: false})
      })
      .catch(err => console.log(err))
      this.setState({updating: false})
  }

  render() {
      if (!this.state.labeler){
        return(

              <LabelerName setName={this
    .setLabeler
    .bind(this)}
    labelerName={this.state.labeler}
              
    
    />
              )
            }
      
      else{

      
          
      
    return (
      <div className="manager-view">
        <Col md={3}>
          <SignficantTermsMananager
                client={this.client}
                index={this.props.index}
                type={this.props.type}
                schema={this.props.schema}
                addNullWord={this.addNullWord.bind(this)}
                moreLikeClass={this.moreLikeClass.bind(this)}
                getSignificantTermsForClass={this.getSignificantTermsForClass.bind(this)}
                terms={this.state.terms}
              />

        </Col>
        <Col md={5} mdOffset={1}>
          <Row>
            <SearchInput onSubmit={this
              .query
              .bind(this)}/>
          </Row>
          <Row>
              {this.state.hits.length}
              examples in queue
          </Row>
          <Row>
              <Examples
                hits={this.state.hits}
                schema={this.props.schema}
                submitClassification={this.submitClassification.bind(this)}
                moreLikeThis={this.moreLikeThis.bind(this)}/>
          
          </Row>
        </Col>

      <Col md={2} mdOffset={1}>
        <Row>
            <NullWordBar
              words={this.state.nullWords}
              removeWord={this
              .removeNullWord
              .bind(this)}
              addWord={this
              .addNullWord
              .bind(this)}/>
        </Row>

    </Col>
      </div>
    )
  }
}

}