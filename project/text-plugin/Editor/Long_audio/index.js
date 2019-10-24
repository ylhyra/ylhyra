import { connect } from 'react-redux'
import tokenize from 'Editor/2-Parse/2.2-Tokenize'
import { synchronize } from 'Editor/4-Audio/Synchronize'
import React from 'react'
import store from 'App/store'
import Upload from './Upload'
import { findAudioSections, deleteAudio } from './actions'

class TranslatingEditor extends React.Component {
  componentDidMount = () => {
    this.load()
  }
  componentDidUpdate(prevProps, prevState) {
    this.load()
  }
  load = () => {
    if (!this.props.editor.parsed) {
      tokenize()
    } else if (!this.props.audio.areSectionsUpdated) {
      findAudioSections()
    }
  }

  render() {
    const { audio, editor, match } = this.props
    if (!editor.input) {
      return null
    }
    if (!editor.parsed) {
      return 'Loading...'
    }
    // console.log(audio.sections)
    return (
      <div className="center">
        Here you can upload audio files. If there is anything in the document that isn't part of the audio track, add the attribute <code>"data-no-audio"</code> to the text tag.
        <br/>
        <br/>
        This functionality is still in beta.
        <br/>
        <br/>

        {audio.sections && (<table>
          <tbody>
            {audio.sections.map(section => (
              <tr key={section.hash}>
                <td>{section.text}</td>
                <td>
                  {audio.files[section.hash] && (<div>
                    <div>File uploaded</div>
                    {audio.sync[section.hash] ? (<b>File synced</b>) : (<div>
                      <button onClick={()=>synchronize(section.hash)}>Synchronize</button> (can take some time, please be patient after clicking)
                    </div>)}
                  </div>)}
                  <Upload hash={section.hash}/>
                </td>
                <td>
                  {audio.files[section.hash] && <div className="button" onClick={()=>deleteAudio(section.hash)}>Delete</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>)}

      </div>
    )
  }
}

export default connect(
  state => ({
    audio: state.editor.audio,
    editor: state.editor,
  })
)(TranslatingEditor)
