import React from 'react'
import { Link } from 'react-router'
import { connect } from 'nuclear-js-react-addons'
import moment from '../../../moment'

import getters from '../getters'
import * as actions from '../actions'

import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'
import NewWorkLog from './NewWorkLog'
import WorkLogItem from './WorkLogItem'

import { isLoggedIn } from '../../auth/getters'

import './WorkLogs.scss'

@connect(props => ({
  worklogs: getters.worklogs,
  isLoggedIn,
}))
export default class List extends React.Component {
  componentDidMount() {
    actions.fetchWorkLogs(1)
  }

  handlePageChange(newPage) {
    actions.fetchWorkLogs(newPage)
  }

  renderWorkLogs() {
    if (!this.props.worklogs.get('data')) {
      return
    }

    const shouldShowLastCol = this.props.worklogs.getIn(['data', 'results']).find(worklog => (
    worklog.get('can_edit') || worklog.get('can_delete')))
    let lastCol = shouldShowLastCol ? <th>&nbsp;</th> : ''

    return (
      <div>
        <table className="table table-striped voucher-workLogsTable">
          <thead>
            <tr>
              <th>Date worked</th>
              <th>Person</th>
              <th>Work group</th>
              <th>Hours</th>
              <th>Current balance</th>
              <th>Comment</th>
              {lastCol}
            </tr>
          </thead>
          <tbody>
            {this.props.worklogs.get('data').get('results').toJS().map((worklog) => (
              <WorkLogItem key={worklog.id} worklog={worklog} showLastCol={shouldShowLastCol}/>
            ))}
          </tbody>
        </table>
        <Pagination
          active={this.props.worklogs.get('data').get('page')}
          pages={this.props.worklogs.get('data').get('pages')}
          onChange={this.handlePageChange}
        />
      </div>
    )
  }

  renderNew() {
    if (this.props.isLoggedIn) {
      return (
        <NewWorkLog />
      )
    }

    return (
      <div className="alert alert-warning">
        You have to <Link to="auth.login">log in</Link> to register work.
      </div>
    )
  }

  render() {
    return (
      <div>
        <h1>Vouchers - work logs</h1>
        <p>
          If you have any problems go
          to <a href="https://cybernetisk.slack.com/messages/it/details/">#it</a> on Slack
        </p>
        {this.renderNew()}
        <Loader
          isLoading={this.props.worklogs.get('isLoading')}
          error={this.props.worklogs.get('error')}
          isEmpty={!this.props.worklogs.get('data')}
        >
          No work data is registered.
        </Loader>
        {this.renderWorkLogs()}
      </div>
    )
  }
}
