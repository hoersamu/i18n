import { findBrowserLocale, getComposer } from 'vue-i18n-routing'
import { useRoute, useRouter, useRequestHeaders, useCookie as _useCookie, useNuxtApp } from '#imports'
import { parseAcceptLanguage } from '#build/i18n.internal.mjs'
import { nuxtI18nInternalOptions, nuxtI18nOptionsDefault, localeCodes as _localeCodes } from '#build/i18n.options.mjs'
import {
  useRouteBaseName as _useRouteBaseName,
  useLocalePath as _useLocalePath,
  useLocaleRoute as _useLocaleRoute,
  useSwitchLocalePath as _useSwitchLocalePath,
  useLocaleHead as _useLocaleHead
} from 'vue-i18n-routing'

import type { Ref } from 'vue'
import type { DetectBrowserLanguageOptions } from '#build/i18n.options.mjs'

export * from 'vue-i18n'
export type { LocaleObject } from 'vue-i18n-routing'
import type { Locale } from 'vue-i18n'

/**
 * The `useRouteBaseName` composable returns function that get the route base name.
 *
 * @remarks
 * The function returned by `useRouteBaseName` is the wrapper function with the same signature as {@link getRouteBaseName}.
 *
 * `useRouteBaseName` is powered by [vue-i18n-routing](https://github.com/intlify/routing/tree/main/packages/vue-i18n-routing).
 *
 * @param route - A route object. if not provided, the route is returned with `useRoute` will be used internally
 *
 * @returns A {@link RouteBaseNameFunction}.
 *
 * @public
 */
export function useRouteBaseName(): ReturnType<typeof _useRouteBaseName> {
  return _useRouteBaseName({
    route: useRoute(),
    router: useRouter(),
    i18n: getComposer(useNuxtApp().$i18n)
  })
}

/**
 * The `useLocalePath` composable returns function that resolve the locale path.
 *
 * @remarks
 * The function returned by `useLocalePath` is the wrapper function with the same signature as {@link localePath}.
 *
 * `useLocalePath` is powered by [vue-i18n-routing](https://github.com/intlify/routing/tree/main/packages/vue-i18n-routing).
 *
 * @returns A {@link LocalePathFunction}.
 *
 * @public
 */
export function useLocalePath(): ReturnType<typeof _useLocalePath> {
  return _useLocalePath({
    router: useRouter(),
    route: useRoute(),
    i18n: getComposer(useNuxtApp().$i18n)
  })
}

/**
 * The `useLocaleRoute` composable returns function that resolve the locale route.
 *
 * @remarks
 * The function returned by `useLocaleRoute` is the wrapper function with the same signature as {@link localeRoute}.
 *
 * `useLocaleRoute` is powered by [vue-i18n-routing](https://github.com/intlify/routing/tree/main/packages/vue-i18n-routing).
 *
 * @returns A {@link LocaleRouteFunction}.
 *
 * @public
 */
export function useLocaleRoute(): ReturnType<typeof _useLocaleRoute> {
  return _useLocaleRoute({
    router: useRouter(),
    route: useRoute(),
    i18n: getComposer(useNuxtApp().$i18n)
  })
}

/**
 * The `useSwitchLocalePath` composable returns function that resolve the locale location.
 *
 * @remarks
 * The function returned by `useSwitchLocalePath` is the wrapper function with the same signature as {@link switchLocalePath}.
 *
 * `useSwitchLocalePath` composable returns function that resolve the locale location. `useSwitchLocalePath` is powered by [vue-i18n-routing](https://github.com/intlify/routing/tree/main/packages/vue-i18n-routing).
 *
 * @returns A {@link SwitchLocalePathFunction}.
 *
 * @public
 */
export function useSwitchLocalePath(): ReturnType<typeof _useSwitchLocalePath> {
  return _useSwitchLocalePath({
    router: useRouter(),
    route: useRoute(),
    i18n: getComposer(useNuxtApp().$i18n)
  })
}

/**
 * The `useLocaleHead` composable returns localized head properties for locale-related aspects.
 *
 * @param options - An options, see about details {@link I18nHeadOptions}.
 *
 * @returns The localized {@link I18nHeadMetaInfo | head properties} with Vue `ref`.
 *
 * @public
 */
export function useLocaleHead(
  options: Pick<
    NonNullable<Parameters<typeof _useLocaleHead>[0]>,
    'addDirAttribute' | 'addSeoAttributes' | 'identifierAttribute'
  > = {
    addDirAttribute: false,
    addSeoAttributes: false,
    identifierAttribute: 'hid'
  }
): ReturnType<typeof _useLocaleHead> {
  const { addDirAttribute, addSeoAttributes, identifierAttribute } = options
  return _useLocaleHead({
    addDirAttribute,
    addSeoAttributes,
    identifierAttribute,
    router: useRouter(),
    route: useRoute(),
    i18n: getComposer(useNuxtApp().$i18n)
  })
}

/**
 * The `useBrowserLocale` composable returns the browser locale.
 *
 * @remarks
 * if this composable function is called on client-side, it detects the locale from the value of `navigator.languages`. Else on the server side, the locale is detected from the value of `accept-language` header.
 *
 * @returns the browser locale, if not detected, return `null`.
 *
 * @public
 */
export function useBrowserLocale(normalizedLocales = nuxtI18nInternalOptions.__normalizedLocales): string | null {
  const headers = useRequestHeaders(['accept-language'])
  return (
    findBrowserLocale(
      normalizedLocales,
      process.client ? (navigator.languages as string[]) : parseAcceptLanguage(headers['accept-language'] || '')
    ) || null
  )
}

/**
 * The `useCookieLocale` composable returns the cookie locale.
 *
 * @remarks
 * If this composable function is called on client-side, it detects the locale from the value of `document.cookie` via `useCookie`. else on the server side, the locale is detected from the value of `cookie` header.
 *
 * Note that if the value of `detectBrowserLanguage.useCookie` is `false`, an empty string is always returned.
 *
 * @returns the cookie locale with Vue `ref`. if not detected, return **empty string** wiht `ref`.
 *
 * @public
 */
export function useCookieLocale({
  useCookie = nuxtI18nOptionsDefault.detectBrowserLanguage.useCookie,
  cookieKey = nuxtI18nOptionsDefault.detectBrowserLanguage.cookieKey,
  localeCodes = _localeCodes
}: Pick<DetectBrowserLanguageOptions, 'useCookie' | 'cookieKey'> & {
  localeCodes: readonly string[]
}): Ref<string> {
  // @ts-ignore NOTE: `ref` is auto-imported from `nuxt`
  const locale: Ref<string> = ref('')

  if (useCookie) {
    let code: string | null = null
    if (process.client) {
      const cookie = _useCookie<string>(cookieKey) as Ref<string>
      code = cookie.value
    } else if (process.server) {
      const cookie = useRequestHeaders(['cookie'])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      code = (cookie as any)[cookieKey]
    }

    if (code && localeCodes.includes(code)) {
      locale.value = code
    }
  }

  return locale
}

const warnRuntimeUsage = (method: string) =>
  console.warn(
    method +
      '() is a compiler-hint helper that is only usable inside ' +
      'the script block of a single file component. Its arguments should be ' +
      'compiled away and passing it at runtime has no effect.'
  )

/**
 * TODO:
 *  `paths`, `locales` completions like `unplugin-vue-router`
 *  ref: https://github.com/posva/unplugin-vue-router
 */

/**
 * The i18n custom route for page components
 */
export interface I18nRoute {
  /**
   * Customize page component routes per locale.
   *
   * @description You can specify static and dynamic paths for vue-router.
   */
  paths?: Record<Locale, string>
  /**
   * Some locales to which the page component should be localized.
   */
  locales?: string[]
}

/**
 * Define custom route for page component
 *
 * @param route - The custom route
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function defineI18nRoute(route: I18nRoute | false): void {
  if (process.dev) {
    warnRuntimeUsage('defineI18nRoute')
  }
}
