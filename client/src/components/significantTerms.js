import React from 'react'
import {
  Row,
  Button,
  Col,
  Label,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap'
import './style.sigterm.css'
import {ClassifcationButtonsRow} from './classificationButton';
const SigTermTagButton = (props) => (
  <Button onClick={() => {
    props.selectTag(props.tagname)
  }}>
    {props.tagname}
  </Button>

)

const StatusMessage = (props) => {
  let text;
  if (!props.tagname) {
    text = "Click on a tag to see its top features"
  } else {
    if (props.terms.length > 0) {
      text = `Feature Words for class ${props.tagname}`
    } else {
      text = `Not enough examples to get features for  ${props.tagname}`
    }

  }

  return (
    <div className="sigterms-status">
      <h3>
        {text}
      </h3>
    </div>
  )
}

export class SignficantTermsMananager extends React.Component {
  /*
    The UI component for the signfiicant terms funcionality.
    The ES client is passed as a prop from the EsManager.
    ESManager stores the signifcant terms
    */
  constructor(props) {
    super(props)
    this.state = {}
  }

  selectTag(tagname) {
    this.setState({
      tagname
    }, (x => {
      this
        .props
        .getSignificantTermsForClass(tagname)
    }))

  }

  moreLikeClass() {

    this
      .props
      .moreLikeClass(this.props.terms)
  }

  componentWillUpdate() {
    if (!this.state.updating) {}
  }

  render() {
    return (
      <div className="sigterm-body">

        <Col mdOffset={1} md={11}>
          <ClassifcationButtonsRow
            schema={this.props.schema}
            submitClassification={this.selectTag.bind(this)}/>
        </Col>
        <Row>
          <Col mdOffset={3}>
            {this.state.tagname
              ? <Button
                  bsStyle="success"
                  onClick={this.moreLikeClass.bind(this)}
                >
                      MORE {this.state.tagname} examples
                </Button>
              : null}
          </Col>
        </Row>
        <Row>
          <Col mdOffset={1}>
            <StatusMessage terms={this.props.terms} tagname={this.state.tagname}/>
          </Col>
          {this.props.terms.map(x => (
              <Col md={4}>
                <span
                  className="sigterm"
                  onClick={() => {
                  this
                    .props
                    .addNullWord(x.key)
                }}>
                  {x.key}
                </span>
              </Col>
            ))}
        </Row>
      </div>
    )
  }
}
