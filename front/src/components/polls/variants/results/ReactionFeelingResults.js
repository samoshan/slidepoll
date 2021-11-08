import { Heading } from 'react-bulma-components'
import { reactionFeeling } from '../../../../variant-definitions'
import ReactionIcon from '../../../ui/ReactionIcon'

export default function ReactionFeelingResults(props) {

  const { poll, results, hideResults, responseCount } = props;

  const presetData = reactionFeeling.presets[poll.preset];
  console.log(presetData);

  const reactionCounts = new Map(results.map((reaction) => [reaction.reaction, reaction.count]));
  const scale = presetData.length > 3 ? 5 : 8;

  return <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around'}}>
    
    {presetData.map((reaction) => {
      const count = reactionCounts.get(reaction.id);
      const percent = responseCount === 0 ? 0 : (count / responseCount) * 100;
      
      return <li style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 100}} key={reaction.id}>
        <ReactionIcon icon={reaction.icon} size={`${scale}x`} />
        {!hideResults && <Heading size='2' style={{minWidth: 100, textAlign: 'center'}}>{percent}%</Heading>}
      </li>
    })}
  </div>
}
