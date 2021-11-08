import React from 'react'
import QRCode from 'qrcode.react'
import axios from 'axios'
import path from 'path'
import { Heading } from 'react-bulma-components'

import VariantManager from '../../VariantManager'
import { getSocket } from '../../App'

export default class PollResults extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.getInitialResults();

    this.socket = getSocket();
    this.socket.on('connect', this.onWsConnect);
    this.socket.on('results', this.onResultsEvent);
  }

  componentWillUnmount() {
    this.socket?.disconnect();
  }

  onWsConnect = () => {
    this.socket.emit('joinResultsRoom', this.props.poll._id);
  }

  getInitialResults = async () => {
    try {
      const response = await axios.get(path.join('/poll', this.props.poll._id, 'results'));
      this.setState({
        results: response.data.results,
        responseCount: response.data.responseCount
      })
    } catch {}
  }

  onResultsEvent = ({ results, responseCount }) => {
    this.setState({ results, responseCount })
  }

  render() {
    const { poll, hideResults, qrUrl } = this.props;
    const { results, responseCount } = this.state;

    const ResultsComponent = VariantManager.get(poll.variant).resultsComponent;

    return (
      <div style={{display: 'flex', 'flexDirection': 'column', 'flexGrow': 1, justifyContent: 'space-between', minHeight: 0}}>

          <div className='results-container'>
            {hideResults &&
            <div className='results-hidden'>
              <QRCode className='qr' value={qrUrl} renderAs='svg' size={250} />
              <Heading size='4'>Results are hidden, join now by scanning the QR code</Heading>
            </div>}
            
            <div className='results-content' style={{maxHeight: '-webkit-fill-available', overflowY: 'auto', paddingRight: 10, display: 'flex', justifyContent: 'center'}}>
              {results && <ResultsComponent poll={poll} results={results} hideResults={hideResults} responseCount={responseCount} />}
            </div>
          </div>

          <div className='results-footer'>
            <Heading size='4'>Number of responses: {responseCount}</Heading>
          </div>
          
        </div>
    )
  }

}
