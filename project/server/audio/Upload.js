// import express from 'express'
// const router = express.Router()
// import query from 'server/database'
// import getParameters from 'server/database/functions/getParameters'
// import multer from 'multer'
// import shortid from 'shortid'
// import path from 'path'
// import { exec } from 'child_process'
// import fs from 'fs'
// import mime from 'mime'
// import urlSlug from 'App/functions/url-slug'
// import mkdirp from 'mkdirp'
// import { upload_path } from 'config.js'
// import synchronize from './Synchronize'
//
// const UploadSettings = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, callback) => {
//       // const upload_path = path.resolve(__dirname, '../../uploads')
//       mkdirp(upload_path, err => {
//         if (err) {
//           console.error(err)
//         }
//         callback(err, upload_path)
//       })
//     },
//     filename: (req, file, callback) => {
//       // console.log(file)
//       const filename = file.originalname.replace(/(\..+)/, '').slice(0, 30) || ''
//       const document_title = urlSlug(req.body.title || '').slice(0, 30) || ''
//       // console.log(req.body )
//       callback(null, urlSlug(filename) + '_' + document_title + '_' + shortid.generate().slice(0,4) + '.' + mime.getExtension(file.mimetype))
//     }
//   }),
//   fileFilter: (req, file, cb) => {
//     if (!['mp3', 'm4a', 'waw', 'jpg', 'jpeg', 'png', ].includes(mime.getExtension(file.mimetype))) {
//       return cb(new Error(`File type "${mime.getExtension(file.mimetype)}" not allowed`))
//     }
//     cb(null, true)
//   },
//   // limits: { fileSize: 100 * 1024 * 1024 }, // For some reason, I can't find a way to handle the error this makes...
// })
//
// router.post('/audio/upload', UploadSettings.single('file'), (req, res) => {
//   // console.log(req.file.path)
//   if(req.file.error) {
//     console.log(req.file.error)
//     res.sendStatus(400)
//     return
//   }
//   if (!req.file || !req.file.filename) {
//     res.send(400)
//   } else {
//     query(
//       `INSERT INTO media SET file = ?`, [req.file.filename], (err, results) => {
//         if (err) {
//           console.error(err)
//         } else {
//           res.send({
//             id: results.insertId,
//             filename: req.file.filename,
//             originalname: req.file.originalname,
//           })
//         }
//       })
//   }
// })
//
//
//
// export default router;
