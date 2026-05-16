import { ReactNode, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import * as z from "zod";
import { IntlProvider } from 'react-intl';


function ZodI18nConfig({ lang }: { lang: string }) {
  const intl = useIntl();

  const locale = z.core.locales?.[navigator.language] || z.core.locales?.[lang];

  // 3. Set the global config
  z.config(locale?.() || z.core.locales.en());

  z.config({
    customError: (iss) => {
      if (iss.code === "too_small") {
        return intl.formatMessage({ defaultMessage: 'Minimum {min} characters' }, { min: iss.minimum });
      }
      // ...
    },
  });
  return null;
}

export function I18nProvider({ children }: { children?: ReactNode }) {
  const l = import('src/i18n/lang/fr.json', { with: { type: 'json' } });
  const lang = navigator.language.split("-")?.[0] || navigator.language;
  const [langMessages, setLangMessages] = useState(null);

  useEffect(() => {
    import(`./lang/${lang}.json`).then(newLangMessages => {
      setLangMessages(newLangMessages)
    }).catch(err => {
      console.log('Failed to load translations', err);
    });
  }, [lang]);

  return (
    <IntlProvider messages={langMessages} locale={lang} defaultLocale="en">
      <ZodI18nConfig lang={lang}/>
      {children}
    </IntlProvider>
  );
}
