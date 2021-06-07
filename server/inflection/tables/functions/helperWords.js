import link from 'tables/link'

/**
 * Before
 * @memberof Word
 * @return {string} HTML as string
 */
export function getHelperWordsBefore() {
  let text = ''
  /* Nouns et al. */
  if (
    this.is('noun') ||
    this.is('adjective') ||
    this.is('past participle') ||
    this.is('pronoun') ||
    this.is('personal pronoun') ||
    this.is('article') ||
    this.is('reflexive pronoun')
  ) {
    if (this.is('nominative', 'singular')) {
      text = 'hér er'
      if (this.getBaseWord() === 'þú') {
        text = 'hér ert'
      }
    }
    if (this.is('nominative', 'plural')) {
      text = 'hér eru'
      if (this.getBaseWord() === 'ég') {
        text = 'hér erum'
      }
      if (this.getBaseWord() === 'þú' || this.getBaseWord() === 'þér') {
        text = 'hér eruð'
      }
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
    text = link('helper words for declension', text)
  }
  /* Verbs */
  else if (this.is('verb') && !this.is('question form')) {
    if (this.is('infinitive')) {
      text = 'að'
    }
    if (this.is('supine')) {
      text = 'ég hef'
    }
    if (this.is('present participle')) {
      text = 'hann er'
    }
    if (this.is('subjunctive')) {
      if (this.is('present tense')) {
        text = 'ég held að '
      }
      if (this.is('past tense')) {
        text = 'ég hélt að '
      }
    }
    if (this.is('singular')) {
      if (this.is('1st person')) {
        text += this.dependingOnSubject('ég', 'mig', 'mér', 'mín', 'það')
      }
      if (this.is('2nd person')) {
        text += this.dependingOnSubject('þú', 'þig', 'þér', 'þín', 'það')
      }
      if (this.is('3rd person')) {
        text += this.dependingOnSubject('hún', 'hana', 'henni', 'hennar', 'það')
      }
    }
    if (this.is('plural')) {
      if (this.is('1st person')) {
        text += this.dependingOnSubject('við', 'okkur', 'okkur', 'okkur', 'það')
      }
      if (this.is('2nd person')) {
        text += this.dependingOnSubject('þið', 'ykkur', 'ykkur', 'ykkur', 'það')
      }
      if (this.is('3rd person')) {
        text += this.dependingOnSubject('þær', 'þær', 'þeim', 'þeirra', 'það')
      }
    }
  }
  return text
}

/**
 * After
 * @memberof Word
 * @return {string} HTML string
 */
export function getHelperWordsAfter() {
  let text = ''
  let addSpace = true

  /* Nouns */
  if (this.is('noun', 'with definite article')) {
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
  else if (this.isAny('adjective', 'past participle', 'article')) {
    if (!this.is('weak declension') /*&& !this.is('article')*/ ) {
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
    } else {
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

  /* Verbs */
  else if (this.is('verb')) {
    if (this.is('present tense')) {
      text = '(í dag)'
    }
    if (this.is('past tense')) {
      text = '(í gær)'
    }
    if (this.is('clipped imperative')) {
      text = 'þú!'
    } else if (this.is('imperative')) {
      text = '!'
      addSpace = false
    }
    if (this.is('question form')) {
      text = '?'
      addSpace = false
    }
  }

  /* Add space between word, except for exclamation marks */
  if (addSpace && text) {
    return ' ' + text
    // return '\u202F\u202F' + text
  } else {
    return text
  }
}
