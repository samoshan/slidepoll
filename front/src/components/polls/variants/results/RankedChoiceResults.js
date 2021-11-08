import React from 'react'
import { Heading } from 'react-bulma-components'

function getColor(value) {
  //value from 0 to 1
  var hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}

export default function RankedChoiceResults(props) {

  const { poll, results, hideResults, responseCount } = props;
  const hasResultsAndVisible = !hideResults && responseCount;

  const items = hideResults ? poll.options : results;

  return <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, margin: 'auto 0', maxWidth: 900, gap: 30}} className='rc-results' >
      {items.map((option, index) => {
        
        const colorFactor = ((option.weight / responseCount) -1) / (results?.length - 1);
        const color = hasResultsAndVisible ? getColor(colorFactor) : null;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }} key={option._id}>
            
            {!hideResults && <div style={{marginRight: 30, width: 40}}><Heading>{index+1}.</Heading></div>}

            <div
              className='box no-bs'
              style={{flexGrow: 1, margin: 0, backgroundColor: color, fontSize: '1.5em', fontWeight: 600, border: '2px solid black'}}
              >
              {option.name}
            </div>

            {!hideResults && <div style={{width: 60, textAlign: 'center'}}>
              <Heading size='5'>{responseCount ? `Avg: ${option.avg}` : ''}</Heading>
            </div>}

          </div>
        )
      })}
  </div>
}
