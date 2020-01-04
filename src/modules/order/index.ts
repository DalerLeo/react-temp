import * as ROUTES from '../../constants/routes'
import { OrderListContainer, OrderDetailContainer } from './containers'

export default (store) => [
  {
    exact: true,
    path: ROUTES.ORDER_LIST_PATH,
    component: OrderListContainer
  },
  {
    exact: true,
    path: ROUTES.ORDER_ITEM_PATH,
    component: OrderDetailContainer
  },
]