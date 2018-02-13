import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addFeed } from '../redux/modules/feeds'
import FullPageLayout from './layouts/FullPageLayout'
import StatusIndicator from '../components/icons/StatusIndicator'

class SubscribeMenu extends React.Component {
  
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    closeModal: PropTypes.func.isRequired,
    addFeed: PropTypes.func.isRequired,
  }

  render() {
    return (
      <FullPageLayout {...this.props}>
        <p>
          Subscribe to:
        </p>
        <ul className="List">
        {this.props.feeds.map(feed => (
          <li key={feed.url} className="List-item">
            <StatusIndicator />
            <a onClick={ (event) => this.handleSubscription(feed) } title={feed.title}>
              {feed.title}
            </a>
          </li>
        ))}
        </ul>
      </FullPageLayout>
    )
  }

  handleSubscription(feed) {
    this.props.closeModal()
    this.props.addFeed(feed)
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  addFeed,
})(SubscribeMenu)