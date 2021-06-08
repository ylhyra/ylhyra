// import React from 'react'
// import { connect } from 'react-redux'
// import styled from 'styled-components'
// import axios from 'User/App/axios'
// import Dropzone from 'react-dropzone'
// import error from 'User/App/Error'
//
// export function upload(files, hash, setState) {
//   return async (dispatch, getState) => {
//     setState({
//       status: 'Uploading...'
//     })
//     // console.log(files)
//     var form = new FormData()
//     // files.forEach(file => {
//     //   form.append('file', file);
//     // })
//     form.append('title', getState().editor.metadata.title || '')
//     form.append('file', files[0])
//     form.append('hash', hash)
//
//     axios.post('/api/audio/upload', form, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       })
//       .then((response) => {
//         const { data } = response
//         // console.log(response)
//         dispatch({
//           type: 'AUDIO_FILE',
//           content: {
//             sectionHash: hash,
//             id: data.id,
//             filename: data.filename
//           }
//         })
//         setState({
//           status: 'Upload completed.'
//         })
//       })
//       .catch((e) => {
//         error('Upload failed')
//         console.error(e);
//         if (e.response.status === 401) {
//           error('File too large!')
//           setState({
//             status: 'File too large.'
//           })
//         } else {
//           error('Upload failed')
//           setState({
//             status: 'Upload failed.'
//           })
//         }
//       })
//       .then(() => {
//         // always executed
//       })
//   }
// }
//
// class Upload extends React.Component {
//   state = {}
//   update = (u) => {
//     this.setState(u)
//   }
//   render() {
//     const { file } = this.props.audio
//     return (
//       // <Dropzone onDrop={this.props.upload.bind(this)}>
//       <Dropzone onDrop={(files)=>this.props.upload(files, this.props.hash, (i)=>this.setState(i))}
//         // style={{height:'100px'}}
//         >
//         <p>
//           {file ? 'To switch to a new file, drop an audio file here' : 'Drop an audio file'}
//         </p>
//         <b>{this.state.status}</b>
//       </Dropzone>
//     )
//   }
// }
//
// export default connect(
//   state => ({
//     audio: state.editor.audio,
//   }), {
//     upload
//   }
// )(Upload)
