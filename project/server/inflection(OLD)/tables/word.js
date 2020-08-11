import React from 'react'
import link from 'server/inflection/tables/link'
import Table from 'server/inflection/tables/table'
import tree from 'server/inflection/tables/tree'
import { getHelperWordsBefore, getHelperWordsAfter } from 'server/inflection/tables/helperWords'

class Word {
  form_classification = []
  word_class = []
  rows = []
  original = []
  constructor(rows, original) {
    Array.isArray(rows) && rows.forEach(({ word_class, form_classification }) => {
      this.form_classification = form_classification || []
      this.word_class = word_class || []
    })
    this.rows = rows
    this.original = original || rows
  }
  is = (...values) => {
    return values.every(value => (
      this.form_classification.includes(value) ||
      this.word_class.includes(value)
    ))
  }
  get = (...values) => {
    return new Word(this.rows.filter(row => (
      values.filter(Boolean).every(value => row.form_classification.includes(value))
    )), this.original)
  }
  getCases = () => {
    return [
      this.get('nominative'),
      this.get('accusative'),
      this.get('dative'),
      this.get('genitive'),
    ]
  }
  getType = (type) => {
    const classification = [...this.word_class, ...this.form_classification]
    switch (type) {
      case 'gender':
        return classification.find(i => ['masculine', 'feminine', 'neuter'].includes(i))
      case 'class':
        return classification.find(i => ['noun', 'verb', 'adjective'].includes(i))
      case 'plurality':
        return classification.find(i => ['singular', 'plural'].includes(i))
      case 'article':
        return classification.find(i => ['with definite article', 'without definite article'].includes(i))
    }
  }
  getHelperWordsBefore = () => {
    return getHelperWordsBefore(this)
  }
  getHelperWordsAfter = () => {
    return getHelperWordsAfter(this)
  }
  dependingOnGender = (...values) => {
    return values[['masculine', 'feminine', 'neuter'].indexOf(this.getType('gender'))]
  }
  dependingOnSubject = (...values) => {
    /* Input is a list of [nom, acc, dat, get, dummy] */
    if (this.is('impersonal with accusative subject')) {
      return values[1]
    } else if (this.is('impersonal with dative subject')) {
      return values[2]
    } else if (this.is('impersonal with genitive subject')) {
      return values[3]
    } else if (this.is('impersonal with dummy subject')) {
      return values[4]
    } else {
      return values[0]
    }
  }
  getId = () => (
    this.original[0].BIN_id
  )
  getBaseWord = () => {
    return this.rows[0] ? this.rows[0].base_word : null
  }
  getTable = () => {
    return Table(this)
  }
  getRows = () => {
    return this.rows
  }
  getTree = () => {
    return tree(this.rows)
  }
  importTree = (input) => {
    let rows = []
    const traverse = (x) => {
      if (Array.isArray(x)) {
        x.map(traverse)
      } else if (x.values) {
        x.values.map(traverse)
      } else {
        rows.push(x)
      }
    }
    traverse(input)
    this.rows = rows
    this.original = rows
    // TODO: Does not make sense, needs restructuring
    this.form_classification = rows[0].form_classification
    this.word_class = rows[0].word_class
    return this
  }
}




export default Word
