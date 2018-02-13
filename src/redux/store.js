import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import throttle from 'lodash/throttle'
import pick from 'lodash/pick'

import feeds from './modules/feeds'
import folders from './modules/folders'
import ui from './modules/ui'
import views from './modules/views'
import discovery from './modules/discovery'
import activeTab from './modules/activeTab'
import modal from './modules/modal'
import toast from './modules/toast'
import { resetableReducer } from './reset'
import { checkpointableReducer } from './checkpoint'

import backgroundActions from './middleware/backgroundActions'
import { loadState, saveState } from './storage'
import logger from './middleware/logger'
import promise from './middleware/promise'
import timeoutScheduler from './middleware/timeoutScheduler'
import notifications from './middleware/notifications'


const initialState = {}
const reducers = {}
const middleware = [notifications, backgroundActions, thunk, promise, timeoutScheduler]
const enhancers = []
const serializePaths = []

// Register Modules:
function addModule(module) {
  if (!module.name) throw new Error("Name required")
  
  if (module.reducer)     reducers[module.name] = module.reducer
  if (module.middleware)  middleware.push(module.middleware)
  if (module.enhancer)    enhancers.push(module.enhancer)
  if (module.serialize)   serializePaths.push(module.name)
}

// Add our local modules
addModule(feeds)
addModule(folders)
addModule(ui)
addModule(views)
addModule(discovery)
addModule(activeTab)
addModule(modal)
addModule(toast)

// Add the logger last so that it can report on everything:
middleware.push(logger)

// Create store
const rootReducer = resetableReducer(
  checkpointableReducer(
    combineReducers(reducers),
    {exclude: [modal.name, discovery.name, activeTab.name]}
  )
)
const enhancedMiddleware = compose(
  applyMiddleware(...middleware),
  ...enhancers
)
const store = createStore(
  rootReducer,
  loadState() || initialState,
  enhancedMiddleware
)

// Save state at most once every 1s
store.subscribe(throttle(() => {
  const state = store.getState()
  const savedState = pick(state, serializePaths)
  
  saveState(savedState)
}, 1000))

export default store