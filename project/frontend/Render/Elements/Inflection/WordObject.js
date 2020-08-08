import React from 'react'
import link from './link'
import Table from './TableObject'

class Word {
  classification = []
  rows = []
  original = []
  constructor(rows, original) {
    console.log(rows)
    // Array.isArray(rows) && rows.forEach(row => {
    //   let classification = row.classification || classify(row) // Previously classified or not
    //   this.rows.push({
    //     classification,
    //     ...row,
    //   })
    //   this.classification = classification // Temporary
    // })
    this.original = original || rows
  }
  is = (...values) => {
    return values.every(value => this.classification.includes(value))
  }
  get = (...values) => (
    new Word(this.rows.filter(row => (
      values.every(value => row.classification.includes(value))
    )), this.original)
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
      case 'plurality':
        return this.classification.find(i => ['singular', 'plural'].includes(i))
      case 'article':
        return this.classification.find(i => ['with definite article', 'without definite article'].includes(i))
    }
  }
  renderCell = (shouldHighlight) => {
    const value = this.rows.map((row, index) => {
      return <span>
        {row.inflectional_form}
        {index+1<this.rows.length && <span className="light-gray"> / </span>}
      </span>
    })
    return [
      <td className={`right ${shouldHighlight ? 'highlight' : ''}`}><span className="gray">{this.getHelperWordsBefore()}</span></td>,
      <td className={`left ${shouldHighlight ? 'highlight' : ''}`}>{value} <span className="gray">{this.getHelperWordsAfter()}</span></td>
    ]
  }
  getHelperWordsBefore = () => {
    let text = ''
    if (this.is('nominative') && this.is('singular')) {
      text = 'hér er'
    }
    if (this.is('nominative') && this.is('plural')) {
      text = 'hér eru'
    }
    if (this.is('accusative')) {
      text = 'um'
    }
    if (this.is('dative')) {
      text = 'frá'
    }
    if (this.is('genitive')) {
      text = 'til'
    }
    return link('helper words for declension', text)
  }
  getHelperWordsAfter = () => {
    let text = ''
    if (this.is('with definite article')) {
      if (this.is('singular')) {
        if (this.is('nominative')) {
          text = this.dependingOnGender('minn', 'mín', 'mitt')
        }
        if (this.is('accusative')) {
          text = this.dependingOnGender('minn', 'mína', 'mitt')
        }
        if (this.is('dative')) {
          text = this.dependingOnGender('mínum', 'minni', 'mínu')
        }
        if (this.is('genitive')) {
          text = this.dependingOnGender('minns', 'minnar', 'míns')
        }
      } else if (this.is('plural')) {
        if (this.is('nominative')) {
          text = this.dependingOnGender('mínir', 'mínar', 'mín')
        }
        if (this.is('accusative')) {
          text = this.dependingOnGender('mína', 'mínar', 'mín')
        }
        if (this.is('dative')) {
          text = this.dependingOnGender('mínum', 'mínum', 'mínum')
        }
        if (this.is('genitive')) {
          text = this.dependingOnGender('minna', 'minna', 'minna')
        }
      }
    }
    return link('helper words for the article',text)
  }
  dependingOnGender = (...values) => {
    return values[['masculine', 'feminine', 'neuter'].indexOf(this.getType('gender'))]
  }
  getId = () => (
    this.rows[0].BIN_id
  )
  getBaseWord = () => {
    return this.rows[0] ? this.rows[0].base_word : null
  }
  getTable = () => {
    return Table(this)
  }
}

export default Word
