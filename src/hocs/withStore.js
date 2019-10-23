import React from 'react'
import { useStore } from 'react-redux'

const withStore = Component => {
  return props => {
    const store = useStore()
    return <Component {...props} store={store} />
  }
}

export default withStore
