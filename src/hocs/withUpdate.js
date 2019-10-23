import { compose, pure, withHandlers, mapProps } from 'react-fc'
import { connect } from 'react-redux'
import { path } from 'ramda'
import { sprintf } from 'sprintf-js'
import { mapResponseToFormError } from '../utils/form'
import { getIdFromProps, getDataFromState } from '../utils/get'
import toSnakeCase from '../utils/toSnakeCase'

export default params => {
  const {
    key = 'update',
    action,
    stateName,
    stateItemName = 'item',
    idKey = 'id',
    redirectUrl,
    onSuccess,
    serializer = toSnakeCase,
    getItemId = getIdFromProps,
    mapInitialValues = data => data
  } = params

  const mapStateToProps = state => ({
    updateState: getDataFromState(stateName, state)
  })

  return compose(
    connect(
      mapStateToProps,
      { action }
    ),
    withHandlers({
      onSubmit: props => values => {
        const id = getItemId(idKey, props)
        return props
          .action(id, serializer(values, props))
          .then(data => {
            if (onSuccess) {
              onSuccess(data, { ...props, values })
            } else if (redirectUrl) {
              props.history.push(sprintf(redirectUrl, id))
            }
          })
          .catch(mapResponseToFormError)
      }
    }),
    mapProps(({ onSubmit, updateState, ...props }) => {
      const data = path([stateItemName, 'data'], props)
      const initialValues = mapInitialValues(data, props)

      return {
        [key]: {
          onSubmit,
          initialValues,
          ...updateState,
          isUpdate: true
        },
        ...props
      }
    }),
    pure
  )
}
