import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import * as ROUTES from '../../constants/routes'
import SignIn from './SignIn'
import { loginAction, userInfoFetch } from './action'

const SignInContainer = props => {
  const dispatch = useDispatch()
  const onLogin = (data) => {
    return dispatch(loginAction(data))
      .then(() => props.history.replace(ROUTES.ORDER_LIST_PATH))

//      .then(({ value }) => dispatch(userInfoFetch(value.token)))
  }
  return (
    <SignIn onLogin={onLogin} />
  )
}
SignInContainer.propTypes = {
  history: PropTypes.object
}
export default SignInContainer
