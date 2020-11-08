Suggestions speed up the translation process, but always need to be manually checked for accuracy.

Suggestions based on previously translated text is available to everyone, but machine translations are currently only offered to verified editors as [Google Cloud Translation](https://cloud.google.com/translate/pricing) is a paid service.

## Sentences

## Words

### How data is stored

Data is stored in **translation frames** to better suggest based on context and to join words from the same unit.

### Each word and frame needs suggestions for

Sentence → hash → suggestion

word → hash →

1. Translation suggestions from our database
2. Translation suggestions from Google Translate
3. Grammatical analysis from [Greynir.is](https://greynir.is/about)
4. Suggestions from the user's input

### Suggestions from the user's input

- 