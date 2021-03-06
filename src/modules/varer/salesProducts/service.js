import reqwest from '../../../utils/reqwest'
import {api} from '../../../api'

export const pageLimit = 500

export function getSalesProducts(page) {
  return reqwest({
    url: api('varer/salgsvarer'),
    data: {limit: pageLimit, page},
    type: 'json'
  })
}
