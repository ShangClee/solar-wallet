import "react-i18next"
import translations from "../../i18n/en"

declare module "react-i18next" {
  interface CustomTypeOptions {
    allowObjectInHTMLChildren: true
    defaultNS: "translation"
    resources: {
      translation: typeof translations
    }
  }
}
