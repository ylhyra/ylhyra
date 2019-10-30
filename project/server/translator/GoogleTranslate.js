const { TranslationServiceClient } = require('@google-cloud/translate').v3beta1;
const { GOOGLE_API_PROJECT_ID } = process.env
const translationClient = new TranslationServiceClient();
async function translateText() {
  if (!GOOGLE_API_PROJECT_ID) return console.error('No Google API project ID')
  const request = {
    parent: translationClient.locationPath(GOOGLE_API_PROJECT_ID, 'global'),
    contents: ["Hvað er þetta eiginlega?"],
    mimeType: 'text/plain', // mime types: text/plain, text/html
    sourceLanguageCode: 'is-IS',
    targetLanguageCode: 'en-US',
  };
  const [response] = await translationClient.translateText(request);
  for (const translation of response.translations) {
    console.log(`Translation: ${translation.translatedText}`);
  }
}

translateText();
