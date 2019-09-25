import path from 'path'

export const url = process.env.NODE_ENV === 'production' ? 'https://ylhyra.egill.xyz/' : 'http://localhost:8000/'
export const login_url = url + 'login'

export const upload_path = path.resolve(__dirname, 'uploads')
export const session_path = path.resolve(__dirname, 'sessions')
 
