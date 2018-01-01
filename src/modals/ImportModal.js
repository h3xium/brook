import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { importOpml } from '../redux/modules/import'

import FullPageLayout from './layouts/FullPageLayout'

import OpmlReader from '../lib/OpmlReader'

class ImportModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: undefined
    }

    this.handleFile = this.handleFile.bind(this)
  }

  render() {
    return (
      <FullPageLayout>
        <p>
          Import a feed list from other readers or services.
        </p>
        
        <form>
          <p>
            <label>
              Select OPML File: 
              <input type="file" className="layout-fill" onChange={this.handleFile}/>
            </label>
          </p>
          {this.state.error && (
            <p className="hasError">
              {this.state.error}
            </p>
          )}
        </form>
        
      </FullPageLayout>
    )
  }

  handleFile(event) {
    const files = event.target.files
    if (!files.length) return

    const file = files[0]
    
    if (file.type && !file.type.startsWith("text/")) {
      this.failWithInvalid()
    }

    this.readFile(file)
  }

  // This reads the file with the OpmlReader and then performs the actual import
  // if it is valid.  This is a bit wasteful (2x parsing cost), however most people
  // should see imports performed in under a second or two anyways.
  readFile(file) {
    const reader = new FileReader()
    reader.onerror = event => this.setState({error: "Could not read file"})
    reader.onload = event => {
      let feedCount = 0
      const text = event.target.result
      
      const opmlReader = new OpmlReader({
        onFeed: (feed) => { feedCount++ },
        onFinish: () => {
          if (feedCount > 0) {
            this.props.closeModal();
            this.props.importOpml(text);
          } else {
            this.failWithInvalid();
          }
        }
      })

      opmlReader.read(text)
    }

    reader.readAsText(file)
  }

  failWithInvalid() {
    this.setState({error: "File does not appear to contain feeds."})
  }
}

const mapStateToProps = (state, props) => ({
  // state...
})

export default connect(mapStateToProps, {
  importOpml,
})(ImportModal)