import MultipleChoiceSettings from '../components/polls/variants/settings/MultipleChoiceSettings'
import MultipleChoiceRespond from '../components/polls/variants/respond/MultipleChoiceRespond'
import MultipleChoiceResults from '../components/polls/variants/results/MultipleChoiceResults'

export default {
    id: 'MultipleChoice',
    name: 'Multiple Choice',
    description: 'Users pick between your options, some of which may be correct',
    icon: 'chart-bar',
    settingsComponent: MultipleChoiceSettings,
    respondComponent: MultipleChoiceRespond,
    resultsComponent: MultipleChoiceResults
}
