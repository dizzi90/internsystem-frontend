import angularModule from '../angularModule'

import '../../../angular_common/ParamsHelper'
import * as VarerHelper from '../common/VarerHelper'
import {getService as SalgsvarerService} from './SalgsvarerService'

angularModule.config(function ($stateProvider) {
  $stateProvider.state('salgsvarer', {
    url: '/varer/salgsvarer?q&group',
    templateUrl: require('./index.html'),
    controller: 'SalgsvarerController as salgsvarer',
    reloadOnSearch: false
  })
})

angularModule.controller('SalgsvarerController', function ($filter, $scope, $stateParams, ParamsHelper) {
  var self = this

  this.varefilter = {
    'text': $stateParams['q'],
    'group': $stateParams['group']
  }

  var filter = VarerHelper.createFilter(
    $scope,
    this.varefilter,
    'salgsvarer.varefilter',
    'salgskonto',
    function () {
      return self.items
    },
    function (res) {
      self.itemsfiltered = res
    }
  )

  var lastPage = -1
  var helper = ParamsHelper.track($scope,
    ['page', 'q', 'group'],
    {
      'salgsvarer.pagination.page': 'page',
      'salgsvarer.varefilter.text': 'q',
      'salgsvarer.varefilter.group': 'group'
    },
    function (params) {
      if (lastPage == -1 || lastPage != params['page']) {
        lastPage = params['page']
        self.items = null

        SalgsvarerService().getList({'page': params['page']}).then(function (res) {
          self.items = res.results.sort(VarerHelper.getSorter('salgskonto'))
          self.pagination = res.pagination
          self.groups = VarerHelper.extractGroups(self.items, 'salgskonto')

          filter()
          $scope.$apply()
        })
      } else {
        filter()
      }
    }
  )

  helper.run()
})
