

export default async (req, res) => {
  // [START translate_quickstart]
  // Imports the Google Cloud client library
  const {Translate} = require('@google-cloud/translate');

  // Instantiates a client
  const translate = new Translate({projectId:process.env:GOOGLE_API_PROJECT_ID});

  // The text to translate
  const text = 'Hello, world!';

  // The target language
  const target = 'ru';

  // Translates some text into Russian
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
  // [END translate_quickstart]
}
