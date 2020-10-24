import viTranslationMessages from '../translations/vi.json';
import enTranslationMessages from '../translations/en.json';

const DEFAULT_LOCALE = 'en';

const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages =
    locale !== DEFAULT_LOCALE
      ? formatTranslationMessages(DEFAULT_LOCALE, viTranslationMessages)
      : {};
  return Object.keys(messages).reduce((formattedMessages, key) => {
    let message = messages[key];
    if (!message && locale !== DEFAULT_LOCALE) {
      message = defaultFormattedMessages[key];
    }
    return Object.assign(formattedMessages, {[key]: message});
  }, {});
};

const translationMessages = {
  vi: formatTranslationMessages('vi', viTranslationMessages),
  en: formatTranslationMessages('en', enTranslationMessages),
};

export { translationMessages };