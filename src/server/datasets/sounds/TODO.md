- Remove duplicates from ISLEX library. Are not actual duplicates, just multiples.
  > SELECT text, COUNT(\*) c FROM sounds GROUP BY text HAVING c > 1;
