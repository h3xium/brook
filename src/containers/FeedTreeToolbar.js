import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { addFeed, fetchAll } from '../redux/modules/feeds'
import workers from '../redux/modules/workers'
import { openModal, openModalLeftAlignedBelow, openModalRightAlignedBelow } from '../redux/modules/modal'
import ui from '../redux/modules/ui'
import discovery from '../redux/modules/discovery'
import activeTab from '../redux/modules/activeTab'

import { MODALS } from '../modals'

import MenuIcon from 'react-feather/dist/icons/more-vertical'
import RefreshIcon from 'react-feather/dist/icons/refresh-cw'

class FeedTreeToolbar extends React.PureComponent {
  static propTypes = {
    currentViewName: PropTypes.string.isRequired,
    unsubscribedFeeds: PropTypes.array.isRequired,
    isFetching: PropTypes.bool,
    addFeed: PropTypes.func.isRequired,
    fetchAll: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    openModalLeftAlignedBelow: PropTypes.func.isRequired,
    openModalRightAlignedBelow: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.handleNewSubscription = this.handleNewSubscription.bind(this)
    this.handleMenu = this.handleMenu.bind(this)
  }

  render() {
    const { fetchAll, isFetching } = this.props
    
    return (
      <div className="Panel-header">
        <span className="isActionable" onClick={ this.handleViewMenu }>
          {this.props.currentViewName}
        </span>
        <span>
          { this.renderSubscribeButton() }
          <RefreshIcon className={`Icon ${isFetching ? "isSpinning" : ""}`} title="Refresh Feeds" onClick={ fetchAll } />
          <MenuIcon className="Icon" onClick={ this.handleMenu } />
        </span>
      </div>
    )
  }

  renderSubscribeButton() {
    const {unsubscribedFeeds} = this.props
    if (unsubscribedFeeds.length === 0) { return }

    return (
      <a title="Subscribe to Feed" onClick={this.handleNewSubscription} className="isActive">
        Subscribe{unsubscribedFeeds.length > 1 ? "… " : " "}
      </a>
    )
  }

  handleNewSubscription() {
    const feeds = this.props.unsubscribedFeeds

    if (!feeds.length) {
      return
    } else if (feeds.length === 1) {
      this.props.addFeed(feeds[0], {fetch: true})
    } else {
      this.props.openModal(MODALS.SubscribeMenu, {feeds})
    }
  }

  handleViewMenu = (event) => {
    const el = event.target
    const modalName = MODALS.TreeViewMenu
    this.props.openModalLeftAlignedBelow(el, modalName)
  }

  handleMenu(event) {
    const el = event.target
    const modalName = event.shiftKey ? MODALS.DebugMenu : MODALS.FeedTreeMenu
    this.props.openModalRightAlignedBelow(el, modalName)
  }
}

const mapStateToProps = (state, props) => ({
  currentViewName: ui.selectors.currentViewName(state),
  unsubscribedFeeds: discovery.selectors.unsubscribedFeeds(state, activeTab.selectors.getActiveTabId(state)),
  isFetching: workers.selectors.hasFeedWorkers(state),
})

export default connect(mapStateToProps, {
  addFeed,
  fetchAll,
  openModal,
  openModalLeftAlignedBelow,
  openModalRightAlignedBelow,
})(FeedTreeToolbar)