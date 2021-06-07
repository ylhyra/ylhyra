import assert from 'assert'
import classify from './../tables/classification/BIN_classification'
import Word from './../tables/word'
import { stripHTML } from './../tables/link'
import { get } from './get'
/*
Other words that might be interesting:
- dró
*/

describe('General word tests', function () {
  it('„farinn“', (done) => {
    get(390363, done, word => {
      assert.equal(word.get('weak declension').getFirstValue(), 'farni')
      assert.equal(word.getFirst().is('masculine'), true)
      assert.equal(word.getFirst().is('neuter'), false)
      // assert.equal(word.getFirst().is('inexistent classification :)'), false)
      assert.equal(word.getType('class'), 'adjective')
      assert.equal(word.getFirst().getType('plurality'), 'singular')
      assert.equal(word.getId(), 390363)
      done()
    })
  })

  it('„Björn“', (done) => {
    get(353885, done, word => {
      /* Test that both variants were returned */
      assert.deepEqual(word.get('genitive').renderForms(), [
        'Björns',
        'B<span class="umlaut">ja</span>rnar'
      ])
      done()
    })
  })

  it('„sjár“', (done) => {
    get(5198, done, word => {
      assert.equal(word.getWordHasUmlaut(), false)
      done()
    })
  })

  it('„muna“', (done) => {
    get(428183, done, word => {
      // console.time('someFunction')
      assert.equal(stripHTML(word.getPrincipalParts()), 'að muna, mig munaði (í gær), ég hef munað')
      assert.equal(word.isStrong(), false)
      assert.equal(word.getIsWordIrregular(), false)
      assert.equal(word.getWordHasUmlaut(), false)
      // console.timeEnd('someFunction')

      done()
    })
  })

  it('„fara“', (done) => {
    get(433568, done, word => {
      /* Test principal part generation from other than first */
      assert.equal(stripHTML(word.get('past').getPrincipalParts()), 'að fara, ég fór (í gær), við fórum (í gær), ég hef farið')
      assert.equal(word.isStrong(), true)
      done()
    })
  })



  // it.only('Junk data', () => {
  //   assert.throws(new Word(['ok']), Error)
  //   return
  // })
})
