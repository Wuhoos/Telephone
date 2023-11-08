import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import App from './components/App'
import 'semantic-ui-css/semantic.min.css'


ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)