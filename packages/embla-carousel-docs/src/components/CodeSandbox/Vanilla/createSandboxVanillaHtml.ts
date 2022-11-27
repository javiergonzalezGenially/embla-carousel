import { THEME_PREFIX } from 'consts/themes'
import { URLS } from 'consts/urls'
import { getThemeFromDocument } from 'utils/getThemeFromDocument'
import { kebabCaseToPascalCase } from 'utils/kebabCaseToPascalCase'
import { SandboxVanillaExtensionType } from '../sandboxTypes'
import {
  SANDBOX_REGEX_LANGUAGE_EXTENSION,
  SANDBOX_REGEX_REPOSITORY_URL,
  SANDBOX_REGEX_THEME,
  SANDBOX_REGEX_TITLE,
} from '../sandboxRegex'

export const createSandboxVanillaDefaultHtml = async (
  id: string = '',
  languageExtension: SandboxVanillaExtensionType,
): Promise<string> => {
  const indexHTML = await import(
    '!!raw-loader!embla-carousel-vanilla-sandboxes/src/SandboxFilesDist/index.html'
  )
  const theme = THEME_PREFIX + getThemeFromDocument()
  const title = kebabCaseToPascalCase(id, ' ')
  return indexHTML.default
    .replace(SANDBOX_REGEX_THEME, theme)
    .replace(SANDBOX_REGEX_TITLE, title)
    .replace(SANDBOX_REGEX_LANGUAGE_EXTENSION, languageExtension)
    .replace(SANDBOX_REGEX_REPOSITORY_URL, URLS.GITHUB_ROOT)
}
