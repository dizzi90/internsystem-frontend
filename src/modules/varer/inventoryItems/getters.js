import {toImmutable} from 'nuclear-js'
import {fillBuyPrice, fillSellPrice, pageLimit} from './service'
import {extractGroupsImmutable, getFilter, getSorterImmutable} from '../common/VarerHelper'

import * as consts from '../consts'

export const listStore = ['varerInventoryItems']

export const activePage = [
  listStore,
  (store) => store.get('activePage')
]

export const pages = [
  listStore,
  (store) => Math.ceil(store.get('count') / pageLimit)
]

export const filters = [
  listStore,
  (store) => store.get('filters')
]

export const items = [
  listStore,
  (store) => store.get('items')
]

export const inventoryItemsLoader = [
  listStore,
  (store) => {
    return {
      isLoading: store.get('isLoading'),
      error: store.get('error'),
      isEmpty: store.get('items').isEmpty()
    }
  }
]

export const inventoryItemsTransformed = [
  items,
  (items) => items
    .map(item => fillBuyPrice(item))
    .map(item => fillSellPrice(item))
    .sort(getSorterImmutable('innkjopskonto'))
]

export const groups = [
  inventoryItemsTransformed,
  (inventoryItems) => extractGroupsImmutable(inventoryItems, 'innkjopskonto')
]

export const selectGroups = [
  groups,
  (groups) => groups.groupBy(group => group.get('gruppe'))
]

export const filteredInventoryItems = [
  inventoryItemsTransformed,
  filters,
  groups,
  (inventoryItems, filters, groups) => {
    inventoryItems = inventoryItems.filter(consts.outdatedOptions.get(filters.get('outdated')).get('filter'))

    if (filters.get('text', '') !== '') {
      inventoryItems = toImmutable(getFilter()(inventoryItems.toJS(), filters.get('text')))
    }

    if (filters.get('group') !== null) {
      let compareGroup = groups.find(g => g.get('id') === filters.get('group'))
      inventoryItems = inventoryItems
        .filter(item => item.get('innkjopskonto').get(compareGroup.get('compare')) === compareGroup.get('compareValue'))
    }

    return inventoryItems
  }
]