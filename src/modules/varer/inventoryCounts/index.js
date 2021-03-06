import React from 'react'
import {Route} from 'react-router'
import reactor from '../../../reactor'

import ListStore from './stores/ListStore'
import ItemStore from './stores/ItemStore'
import ItemCountsStore from './stores/ItemCountsStore'
import FilterStore from './stores/FilterStore'

import List from './list/List'
import InventoryCount from './item/Item'
import Registrations from './registrations/Item'

reactor.registerStores({
  varerInventoryCounts: ListStore,
  varerInventoryCount: ItemStore,
  varerInventoryCountFilter: FilterStore,
  varerInventoryCountCounts: ItemCountsStore,
})

export default (
  <Route>
    <Route name="varer/inventorycounts" path="/varer/inventorycounts" handler={List}/>
    <Route name="varer/inventorycount" path="/varer/inventorycount/:id" handler={InventoryCount}/>
    <Route name="varer/inventorycount/registrations" path="/varer/inventorycount/:id/registrations" handler={Registrations}/>
  </Route>
)
