import _hash from 'project/frontend/App/functions/hash'
const data = [
  // { is: `heima`, en: `at home` },
  // { is: `að búa`, en: `to live somewhere, to reside` },
  // { is: `ég bý`, en: `I live somewhere, I reside` },
  // { is: `þú býrð`, en: `you live somewhere, you reside` },
  // { is: `hann býr`, en: `he lives somewhere, he resides` },
  // { is: `frekar`, en: `rather, somewhat` },
  // { is: `lengi`, en: `for long` },
  // { is: `norður`, en: `north` },
  // { is: `Ég bý hérna.`, en: `I live here.` },
  // { is: `Ég bý ekki hérna.`, en: `I don't live here.` },
  // { is: `Mamma þín býr í Boston.`, en: `Your mother lives in Boston.` },
  // { is: `Mamma þín býr ekki í Boston.`, en: `Your mother doesn't live in Boston.` },
  // { is: `Það er gott að búa í Reykjavík.`, en: `It's good to live in Reykjavík.` },
  // { is: `Ég veit það ekki alveg.`, en: `I don't quite know.` },
  // { is: `Það er frekar gott.`, en: `It's rather good.` },
  // { is: `sæll`, en: `hello (formal, addressing a man)` },
  // { is: `sæl`, en: `hello (formal, addressing a woman)` },
  // { is: `hæ`, en: `hi` },
  // { is: `halló`, en: `hello (relatively informal)` },
  // { is: `góðan daginn`, en: `good day to you` },
  // { is: `já`, en: `yes` },
  // { is: `jú`, en: `yes (responding to a negative question)` },
  // { is: `nei`, en: `no` },
  // { is: `já já`, en: `yeah sure (more casual than just "já")` },
  // { is: `á eftir`, en: `later today (literally "on afterwards")` },
  // { is: `mér finnst`, en: `I am of the opinion that` },
  // { is: `þér finnst`, en: `you are of the opinion that` },
  // { is: `ágætt`, en: `fairly good, so-so, mostly okay` },
  // { is: `mig langar í hamborgara`, en: `I desire a hamburger` },
  // { is: `kartöflur`, en: `potatoes` },
  // { is: `franskar kartöflur`, en: `french fries` },
  // { is: `heimsókn`, en: `a visit` },
  // { is: `allt í lagi`, en: `all okay` },

  { is: `bekræfte`, en: `játa, staðfesta` },
  { is: `besynderlig`, en: `undarlegt` },
  { is: `forhold`, en: `ástarsamband; lífskjör; hagur` },
  { is: `erfaring`, en: `reynsla, lífsreynsla` },
  { is: `betryggende`, en: `tilhraustandi` },
  { is: `erhvervsliv`, en: `einkageirinn, atvinnulíf` },
  // { is: `blot`, en: `bara, aðeins` },
  // { is: `bolig`, en: `híbýli` },
  // { is: `foretage`, en: `aðhafast` },
]

let cards_data = []
data.forEach(({ is, en }) => {
  const hash = _hash(is.trim())
  cards_data.push({ is, en, from: 'is', belongs_to: hash, id: hash + '_is' })
  cards_data.push({ is, en, from: 'en', belongs_to: hash, id: hash + '_en' })
})

export default cards_data
