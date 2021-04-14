import React from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import store from 'App/store'
import error from 'App/Error'
import { isBrowser } from 'project/frontend/App/functions/isBrowser'
import _hash from 'project/frontend/App/functions/hash'
import axios from 'axios'
import LoadGoogleDocs from 'Vocabulary/actions/setup'
import { loadDeck } from 'Vocabulary/actions/deck'
const url = process.env.NODE_ENV === 'development' ? 'https://localhost:8000' : ''

export default async(input) => {
  const cards = await LoadGoogleDocs()
  loadDeck(cards)
}
