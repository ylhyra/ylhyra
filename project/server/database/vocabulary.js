import { Pool, Query } from 'server/database/functions/connection'

const pool = Pool({
  database: 'vocabulary',
  user: process.env.VOCABULARY_DATABASE_USER || 'egill',
  password: process.env.VOCABULARY_DATABASE_PASSWORD || 'egill',
})

export default (query, secondParameter, thirdParameter) => Query(query, secondParameter, thirdParameter, pool)
