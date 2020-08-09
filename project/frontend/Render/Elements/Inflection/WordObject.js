import React from 'react'
import link from './link'
import Table from './TableObject'
import tree from './tree'

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
      values.every(value => row.form_classification.includes(value))
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
    switch (type) {
      case 'gender':
        return this.form_classification.find(i => ['masculine', 'feminine', 'neuter'].includes(i))
      case 'class':
        return this.form_classification.find(i => ['noun', 'verb', 'adjective'].includes(i))
      case 'plurality':
        return this.form_classification.find(i => ['singular', 'plural'].includes(i))
      case 'article':
        return this.form_classification.find(i => ['with definite article', 'without definite article'].includes(i))
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
      <td className={`left ${shouldHighlight ? 'highlight' : ''}`}>{value}</td>,
      <td className={`left ${shouldHighlight ? 'highlight' : ''}`}><span className="gray">{this.getHelperWordsAfter()}</span></td>,
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
    /* Nouns */
    if (this.is('noun') && this.is('with definite article')) {
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
      text = link('helper words for the article', text)
    }
    /* Adjectives & past participle */
    else if (this.is('adjective') || this.is('past participle')) {
      if (!this.is('weak declension')) {
        if (this.is('singular')) {
          if (this.is('nominative')) {
            text = this.dependingOnGender('maður', 'kona', 'barn')
          }
          if (this.is('accusative')) {
            text = this.dependingOnGender('mann', 'konu', 'barn')
          }
          if (this.is('dative')) {
            text = this.dependingOnGender('manni', 'konu', 'barni')
          }
          if (this.is('genitive')) {
            text = this.dependingOnGender('manns', 'konu', 'barns')
          }
        } else if (this.is('plural')) {
          if (this.is('nominative')) {
            text = this.dependingOnGender('menn', 'konur', 'börn')
          }
          if (this.is('accusative')) {
            text = this.dependingOnGender('menn', 'konur', 'börn')
          }
          if (this.is('dative')) {
            text = this.dependingOnGender('mönnum', 'konum', 'börnum')
          }
          if (this.is('genitive')) {
            text = this.dependingOnGender('manna', 'kvenna', 'barna')
          }
        }
      } else if (this.is('weak declension')) {
        if (this.is('singular')) {
          if (this.is('nominative')) {
            text = this.dependingOnGender('maðurinn', 'konan', 'barnið')
          }
          if (this.is('accusative')) {
            text = this.dependingOnGender('manninn', 'konuna', 'barnið')
          }
          if (this.is('dative')) {
            text = this.dependingOnGender('manninum', 'konunni', 'barninu')
          }
          if (this.is('genitive')) {
            text = this.dependingOnGender('mannsins', 'konunnar', 'barnsins')
          }
        } else if (this.is('plural')) {
          if (this.is('nominative')) {
            text = this.dependingOnGender('mennirnir', 'konurnar', 'börnin')
          }
          if (this.is('accusative')) {
            text = this.dependingOnGender('mennina', 'konurnar', 'börnin')
          }
          if (this.is('dative')) {
            text = this.dependingOnGender('mönnunum', 'konunum', 'börnunum')
          }
          if (this.is('genitive')) {
            text = this.dependingOnGender('mannanna', 'kvennanna', 'barnanna')
          }
        }
      }
    }
    return text
  }
  dependingOnGender = (...values) => {
    return values[['masculine', 'feminine', 'neuter'].indexOf(this.getType('gender'))]
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
    return this
  }
}




export default Word
