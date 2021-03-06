import React from 'react'
import { Link } from 'react-router'
import { connect } from 'nuclear-js-react-addons'
import moment from '../../../moment'
import getters from '../getters'
import * as actions from '../actions'

import Pagination from '../../../components/Pagination'
import Loader from '../../../components/Loader'

import List from './List'

import MemberService from '../services/MemberService'
import { userDetails, isLoggedIn } from '../../auth/getters'

@connect(props => ({
  userDetails,
  isLoggedIn,
  stats: getters.stats,
  members: getters.members
}))
export default class Semester extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loaded: false}
  }

  componentDidMount() {
    const semId = this.props.params.semId
    MemberService.getSemesterStats(semId).then(result => {
      this.setState({
        id: result.id,
        semester: result.semester,
        lifetime: result.lifetime,
        normal: result.normal,
        honorary: result.honorary,
        loaded: true
      })
    }, error => {
      alert(error.responseText)
    })
    actions.getSemMemberList(semId, 1, 50)
  }

  render() {
    if (!this.props.isLoggedIn) {
      return (
        <h1>You haven't logged in! Please login!</h1>
      )
    }
    if (!this.state.loaded) {
      return (
        <h1>Loading...</h1>
      )
    }

    return (
      <div>
        <Loader
          isLoading={this.props.members.get('isLoading')}
          error={this.props.members.get('error')}
          isEmpty={!this.props.members.get('data')}
        >
          No semesters registered!
        </Loader>
        {this.renderNormal()}
      </div>
    )

  }

  renderNormal() {
    return (
      <div>
        <h1>{this.state.semester}</h1>
        <Link to="/member">Go back to overview</Link>
        {this.renderStatsTable()}
        <h2>Memberlist</h2>
        <List switcher={true} semId={this.props.params.semId}/>
      </div>
    )
  }

  renderStatsTable() {
    return (
      <table className="table table-condensed">
        <thead>
          <tr>
            <th>Normal</th>
            <th>Lifetime</th>
            <th>Honorary</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{this.state.normal}</td>
            <td>{this.state.lifetime}</td>
            <td>{this.state.honorary}</td>
          </tr>
        </tbody>
      </table>
    )
  }

}
