import RankedChoiceSettings from '../components/polls/variants/settings/RankedChoiceSettings'
import RankedChoiceRespond from '../components/polls/variants/respond/RankedChoiceRespond'
import RankedChoiceResults from '../components/polls/variants/results/RankedChoiceResults'

export default {
    id: 'RankedChoice',
    name: 'Ranked Choice',
    description: 'Users rearrange your options in an order of preference',
    icon: 'list-ol',
    settingsComponent: RankedChoiceSettings,
    respondComponent: RankedChoiceRespond,
    resultsComponent: RankedChoiceResults
}
