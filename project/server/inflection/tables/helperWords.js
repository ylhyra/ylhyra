import link from 'server/inflection/tables/link'

/*
  Before
*/
export const getHelperWordsBefore = (word) => {
  let text = ''
  /* Nouns et al. */
  if (word.is('noun') || word.is('adjective') || word.is('past participle')) {
    if (word.is('nominative') && word.is('singular')) {
      text = 'hér er'
    }
    if (word.is('nominative') && word.is('plural')) {
      text = 'hér eru'
    }
    if (word.is('accusative')) {
      text = 'um'
    }
    if (word.is('dative')) {
      text = 'frá'
    }
    if (word.is('genitive')) {
      text = 'til'
    }
    text = link('helper words for declension', text)
  }
  /* Verbs */
  else if (word.is('verb') && !word.is('question form')) {
    if (word.is('infinitive')) {
      text = 'að'
    }
    if (word.is('supine')) {
      text = 'ég hef'
    }
    if (word.is('present participle')) {
      text = 'hann er'
    }
    if (word.is('subjunctive')) {
      if (word.is('present tense')) {
        text = 'ég held að '
      }
      if (word.is('past tense')) {
        text = 'ég hélt að '
      }
    }
    if (word.is('singular')) {
      if (word.is('1st person')) {
        text += word.dependingOnSubject('ég', 'mig', 'mér', 'mín', 'það')
      }
      if (word.is('2nd person')) {
        text += word.dependingOnSubject('þú', 'þig', 'þér', 'þín', 'það')
      }
      if (word.is('3rd person')) {
        text += word.dependingOnSubject('hún', 'hana', 'henni', 'hennar', 'það')
      }
    }
    if (word.is('plural')) {
      if (word.is('1st person')) {
        text += word.dependingOnSubject('við', 'okkur', 'okkur', 'okkur', 'það')
      }
      if (word.is('2nd person')) {
        text += word.dependingOnSubject('þið', 'ykkur', 'ykkur', 'ykkur', 'það')
      }
      if (word.is('3rd person')) {
        text += word.dependingOnSubject('þær', 'þær', 'þeim', 'þeirra', 'það')
      }
    }
  }
  return text
}

/*
  After
*/
export const getHelperWordsAfter = (word) => {
  let text = ''
  let addSpace = true

  /* Nouns */
  if (word.is('noun') && word.is('with definite article')) {
    if (word.is('singular')) {
      if (word.is('nominative')) {
        text = word.dependingOnGender('minn', 'mín', 'mitt')
      }
      if (word.is('accusative')) {
        text = word.dependingOnGender('minn', 'mína', 'mitt')
      }
      if (word.is('dative')) {
        text = word.dependingOnGender('mínum', 'minni', 'mínu')
      }
      if (word.is('genitive')) {
        text = word.dependingOnGender('minns', 'minnar', 'míns')
      }
    } else if (word.is('plural')) {
      if (word.is('nominative')) {
        text = word.dependingOnGender('mínir', 'mínar', 'mín')
      }
      if (word.is('accusative')) {
        text = word.dependingOnGender('mína', 'mínar', 'mín')
      }
      if (word.is('dative')) {
        text = word.dependingOnGender('mínum', 'mínum', 'mínum')
      }
      if (word.is('genitive')) {
        text = word.dependingOnGender('minna', 'minna', 'minna')
      }
    }
    text = link('helper words for the article', text)
  }

  /* Adjectives & past participle */
  else if (word.is('adjective') || word.is('past participle')) {
    if (!word.is('weak declension')) {
      if (word.is('singular')) {
        if (word.is('nominative')) {
          text = word.dependingOnGender('maður', 'kona', 'barn')
        }
        if (word.is('accusative')) {
          text = word.dependingOnGender('mann', 'konu', 'barn')
        }
        if (word.is('dative')) {
          text = word.dependingOnGender('manni', 'konu', 'barni')
        }
        if (word.is('genitive')) {
          text = word.dependingOnGender('manns', 'konu', 'barns')
        }
      } else if (word.is('plural')) {
        if (word.is('nominative')) {
          text = word.dependingOnGender('menn', 'konur', 'börn')
        }
        if (word.is('accusative')) {
          text = word.dependingOnGender('menn', 'konur', 'börn')
        }
        if (word.is('dative')) {
          text = word.dependingOnGender('mönnum', 'konum', 'börnum')
        }
        if (word.is('genitive')) {
          text = word.dependingOnGender('manna', 'kvenna', 'barna')
        }
      }
    } else {
      if (word.is('singular')) {
        if (word.is('nominative')) {
          text = word.dependingOnGender('maðurinn', 'konan', 'barnið')
        }
        if (word.is('accusative')) {
          text = word.dependingOnGender('manninn', 'konuna', 'barnið')
        }
        if (word.is('dative')) {
          text = word.dependingOnGender('manninum', 'konunni', 'barninu')
        }
        if (word.is('genitive')) {
          text = word.dependingOnGender('mannsins', 'konunnar', 'barnsins')
        }
      } else if (word.is('plural')) {
        if (word.is('nominative')) {
          text = word.dependingOnGender('mennirnir', 'konurnar', 'börnin')
        }
        if (word.is('accusative')) {
          text = word.dependingOnGender('mennina', 'konurnar', 'börnin')
        }
        if (word.is('dative')) {
          text = word.dependingOnGender('mönnunum', 'konunum', 'börnunum')
        }
        if (word.is('genitive')) {
          text = word.dependingOnGender('mannanna', 'kvennanna', 'barnanna')
        }
      }
    }
  }

  /* Verbs */
  else if (word.is('verb')) {
    if (word.is('present tense')) {
      text = '(í dag)'
    }
    if (word.is('past tense')) {
      text = '(í gær)'
    }
    if (word.is('imperative')) {
      text = '!'
      addSpace = false
    }
    if (word.is('question form')) {
      text = '?'
      addSpace = false
    }
  }

  /* Add space between word, except for exclamation marks */
  if (addSpace) {
    return '\u202F\u202F' + text
  } else {
    return text
  }
}
