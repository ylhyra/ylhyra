import React from 'react'
import { classify } from './classify'

export class Word {
  classification = []
  rows = []
  constructor(props) {
    props.forEach(row => {
      let classification = row.classification || classify(row) // Previously classified or not
      this.rows.push({
        classification,
        ...row,
      })
      this.classification = classification // Temporary
    })
  }
  is = (value) => {
    return this.classification.includes(value)
  }
  get = (...values) => (
    new Word(this.rows.filter(row => (
      values.every(value => row.classification.includes(value))
    )))
  )
  getCases = () => {
    return [
      this.get('nominative'),
      this.get('accusative'),
      this.get('dative'),
      this.get('genitive'),
    ]
  }
  getType = (type) => {
    switch (type) {
      case 'gender':
        return this.classification.find(i => ['masculine', 'feminine', 'neuter'].includes(i))
      case 'class':
        return this.classification.find(i => ['noun', 'verb', 'adjective'].includes(i))
    }
  }
  renderCell = () => {
    const value = this.rows.map(row => {
      return row.inflectional_form
    }).join(', ')
    return <div>
      <span className="gray">{this.getHelperWordsBefore()}</span> {value} <span className="gray">{this.getHelperWordsAfter()}</span>
    </div>
  }
  getHelperWordsBefore = () => {
    if (this.is('nominative') && this.is('singular')) {
      return 'hér er'
    }
    if (this.is('nominative') && this.is('plural')) {
      return 'hér eru'
    }
    if (this.is('accusative')) {
      return 'um'
    }
    if (this.is('dative')) {
      return 'frá'
    }
    if (this.is('genitive')) {
      return 'til'
    }
    return ''
  }
  getHelperWordsAfter = () => {
    if (this.is('with-article')) {
      if (this.is('singular')) {
        if (this.is('nominative')) {
          return this.dependingOnGender('minn', 'mín', 'mitt')
        }
        if (this.is('accusative')) {
          return this.dependingOnGender('minn', 'mína', 'mitt')
        }
        if (this.is('dative')) {
          return this.dependingOnGender('mínum', 'minni', 'mínu')
        }
        if (this.is('genitive')) {
          return this.dependingOnGender('minns', 'minnar', 'míns')
        }
      } else if (this.is('plural')) {
        if (this.is('nominative')) {
          return this.dependingOnGender('mínir', 'mínar', 'mín')
        }
        if (this.is('accusative')) {
          return this.dependingOnGender('mína', 'mínar', 'mín')
        }
        if (this.is('dative')) {
          return this.dependingOnGender('mínum', 'mínum', 'mínum')
        }
        if (this.is('genitive')) {
          return this.dependingOnGender('minna', 'minna', 'minna')
        }
      }
    }
    return ''
  }
  dependingOnGender = (...values) => {
    return values[['masculine', 'feminine', 'neuter'].indexOf(this.getType('gender'))]
  }
  getId = () => (
    this.rows[0].BIN_id
  )
}
