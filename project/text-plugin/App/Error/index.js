import store from 'App/store'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function(message) {
  console.error(message)
  toast.error(message, {
    position: toast.POSITION.BOTTOM_RIGHT,
    autoClose: 30*1000,
  })
}
