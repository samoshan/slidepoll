import OpenEndedRespond from '../components/polls/variants/respond/OpenEndedRespond'
import OpenEndedResults from '../components/polls/variants/results/OpenEndedResults'

export default {
    id: 'OpenEnded',
    name: 'Open Ended',
    description: 'Users freely type their own responses to the prompt',
    icon: 'paragraph',
    respondComponent: OpenEndedRespond,
    resultsComponent: OpenEndedResults
}
