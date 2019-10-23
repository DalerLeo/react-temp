import { compose, mapProps, withHandlers } from 'react-fc'
import { connect } from 'react-redux'
import { mapResponseToFormError } from '../utils/form'
import { getDataFromState } from '../utils/get'
import toSnakeCase from '../utils/toSnakeCase'

const withCreate = params => {
  const {
    key = 'create',
    action,
    stateName,
    redirectUrl,
    onSuccess,
    serializer = toSnakeCase
  } = params

  const mapStateToProps = state => ({
    createState: getDataFromState(stateName, state)
  })

  const mapDispatchToProps = { action }

  return compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    ),
    withHandlers({
      onSubmit: props => values => {
        return props
          .action(serializer(values, props))
          .then(data => {
            if (onSuccess) {
              onSuccess(data, { ...props, values })
            } else if (redirectUrl) {
              props.history.push(redirectUrl)
            }
          })
          .catch(mapResponseToFormError)
      }
    }),
    mapProps(({ onSubmit, createState, ...props }) => ({
      [key]: {
        onSubmit,
        ...createState
      },
      ...props
    }))
  )
}

export default withCreate
