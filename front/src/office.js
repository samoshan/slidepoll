/* eslint-disable no-undef */
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'

import './styles.css'
import { OfficeApp } from './App'

Office.initialize = () => {
    ReactDOM.render(
        <HashRouter>
            <OfficeApp />
        </HashRouter>
    , document.getElementById('root'));
    
}
