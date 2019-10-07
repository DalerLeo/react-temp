import React from 'react'
import { Provider } from 'react-redux'
import {ThemeProvider} from 'styled-components'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import RoutesWithSubRoutes from './components/RouteWithSubRoutes'
import NormalizedStyles from 'components/StyledElems/NormalizedStyles'
const App = ({routes, store}) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={{}}>
        <React.Fragment>
          <NormalizedStyles />
          <Router>
            <Switch>
              {routes.map((route, i) => (
                <RoutesWithSubRoutes key={i} {...route} />
              ))}
            </Switch>
          </Router>
        </React.Fragment>
      </ThemeProvider>
    </Provider>


  )
}

export default App
