import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames';
import { Heading } from 'react-bulma-components'

function OptionResult({ option, percent, width }) {
  return <div className='mc-results-option'>
    <div className='name'>
      <Heading>{option.name}</Heading>
    </div>
    <div className='bar-container'>
      <div className={classNames('bar', option.correct && 'correct')} style={{width: `${width * 100}%`}}>
        <div className='side'>
          <p>{Math.round(percent * 100)}%</p>
          {option.correct && <FontAwesomeIcon icon='check' size='1x' style={{fontSize: '1.5em'}} />}
        </div>
      </div>
    </div>
  </div>
}

export default function MultipleChoiceResults(props) {

  const { results, responseCount, hideResults } = props;

  if (hideResults) {
    return <div style={{display: 'flex', flexDirection: 'column', margin: 'auto 0', flexGrow: 1, maxWidth: 900, fontSize: '1.5em', fontWeight: 600}} className='mc-results-hidden'>
      {results.map((option) => <div className='box' key={option._id} style={{border: '2px solid black'}}>
        {option.name}
      </div>)}
    </div>
  }

  const percentages = new Map();
  let maxPercentage = 0;
  for (const result of results) {
    const percent = responseCount ? (result.count / responseCount) : 0;
    percentages.set(result._id, percent);
    if (percent > maxPercentage) {
      maxPercentage = percent;
    }
  }

  return <div className='mc-results-shown'>
    {results.map((option) => 
      <OptionResult
        key={option._id}
        option={option}
        percent={percentages.get(option._id)}
        width={responseCount ? (percentages.get(option._id) / maxPercentage) : 0}
        />
    )}
  </div>
}
