import ReactionFeelingRespond from '../components/polls/variants/respond/ReactionFeelingRespond'
import ReactionFeelingResults from '../components/polls/variants/results/ReactionFeelingResults'
import ReactionFeelingSettings from '../components/polls/variants/settings/ReactionFeelingSettings'

export default {
    id: 'ReactionFeeling',
    name: 'Reactions',
    description: 'Users select between icons of different reactions',
    icon: ['far', 'smile'],
    settingsComponent: ReactionFeelingSettings,
    respondComponent: ReactionFeelingRespond,
    resultsComponent: ReactionFeelingResults,
    presets: {
        'thumbs-2': [
            {
                id: 'thumbs-up',
                icon: 'thumbs-up'
            },
            {
                id: 'thumbs-down',
                icon: 'thumbs-down'
            }
        ],
        'thumbs-3': [
            {
                id: 'thumbs-up',
                icon: 'thumbs-up'
            },
            {
                id: 'thumbs-side',
                icon: ['thumbs-up', 90]
            },
            {
                id: 'thumbs-down',
                icon: 'thumbs-down'
            }
        ],
        'faces-3': [
            {
                id: 'happy',
                icon: 'smile'
            },
            {
                id: 'ok',
                icon: 'meh'
            },
            {
                id: 'sad',
                icon: 'frown'
            }
        ],
        'faces-5': [
            {
                id: 'very-happy',
                icon: 'grin-beam'
            },
            {
                id: 'happy',
                icon: 'smile'
            },
            {
                id: 'ok',
                icon: 'meh'
            },
            {
                id: 'sad',
                icon: 'frown'
            },
            {
                id: 'very-sad',
                icon: 'sad-cry'
            }
        ]
    }
}
