import { Pool, Query } from 'server/database/functions/connection'

const pool = Pool({
  database: 'punktur',
  user: process.env.TAGGER_DATABASE_USER || 'egill',
  password: process.env.TAGGER_DATABASE_PASSWORD || 'egill',
})

export default (query, secondParameter, thirdParameter) => Query(query, secondParameter, thirdParameter, pool)
