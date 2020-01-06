import React from 'react'
import OrderDetail from '../components/OrderDetail'
import { orderItemFetch } from '../action/actions'
import { useFetchItem } from '../../../hooks'
import * as stateNames from '../../../constants/stateNames'
import Layout from '../../../components/Layouts/Layout'

const OrderDetailContainer = props => {
  const data = useFetchItem({
    action: orderItemFetch,
    stateName: stateNames.ORDER_ITEM
  })

  return (
    <Layout>
      <OrderDetail
        item={data}
        onDelete={() => null}
        onEdit={() => null}
      />
    </Layout>
  )
}
export default OrderDetailContainer
