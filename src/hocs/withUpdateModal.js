import { compose, pure, withHandlers, mapProps } from 'react-fc'
import { connect } from 'react-redux'
import { path } from 'ramda'
import { replaceParamsRoute } from '../utils/route'
import { getBooleanFromHistory, getDataFromState, getIdFromProps } from '../utils/get'
import { mapResponseToFormError } from '../utils/form'
import toSnakeCase from '../utils/toSnakeCase'

const onClose = ({ history }, values, key) =>
  replaceParamsRoute({ [key]: false }, history)
const onOpen = ({ history }, values, key) =>
  replaceParamsRoute({ [key]: true }, history)

const withUpdateModal = params => {
  const {
    key = 'updateModal',
    action,
    stateName,
    redirectUrl,
    onSuccess,
    stateItemName = 'item',
    idKey = 'id',
    serializer = toSnakeCase,
    onCloseHandler = onClose,
    onOpenHandler = onOpen,
    openHandler = getBooleanFromHistory,
    mapInitialValues = data => data,
    getItemId = getIdFromProps,

  } = params

  const mapStateToProps = state => ({
    updateState: getDataFromState(stateName, state)
  })

  const mapDispatchToProps = { action }

  return compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    ),
    withHandlers({
      onClose: props => values => onCloseHandler(props, values, key),
      onOpen: props => values => onOpenHandler(props, values, key),
      onSubmit: props => values => {
        const id = getItemId(idKey, props)
        return props
          .action(id, serializer(values, props))
          .then(data => {
            if (onSuccess) {
              onSuccess(data, { ...props, values })
            } else if (redirectUrl) {
              props.history.push(redirectUrl)
            }
          })
          .then(() => onCloseHandler(props, values, key))
          .catch(mapResponseToFormError)
      }
    }),
    mapProps(({ onClose, onOpen, onSubmit, updateState, ...props }) => {
      const data = path([stateItemName, 'data'], props)
      const initialValues = mapInitialValues(data, props)
      return {
        [key]: {
          onClose,
          onOpen,
          onSubmit,
          ...updateState,
          initialValues,
          isUpdate: true,
          open: openHandler(key, props.history),
        },
        ...props
      }
    }),
    pure
  )
}

export default withUpdateModal
