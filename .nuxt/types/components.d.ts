
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  Badge: typeof import("../../components/ui/badge/index")['Badge']
  Button: typeof import("../../components/ui/button/index")['Button']
  Card: typeof import("../../components/ui/card/index")['Card']
  CardContent: typeof import("../../components/ui/card/index")['CardContent']
  CardDescription: typeof import("../../components/ui/card/index")['CardDescription']
  CardFooter: typeof import("../../components/ui/card/index")['CardFooter']
  CardHeader: typeof import("../../components/ui/card/index")['CardHeader']
  CardTitle: typeof import("../../components/ui/card/index")['CardTitle']
  Input: typeof import("../../components/ui/input/index")['Input']
  Label: typeof import("../../components/ui/label/index")['Label']
  Select: typeof import("../../components/ui/select/index")['Select']
  SelectContent: typeof import("../../components/ui/select/index")['SelectContent']
  SelectGroup: typeof import("../../components/ui/select/index")['SelectGroup']
  SelectItem: typeof import("../../components/ui/select/index")['SelectItem']
  SelectItemText: typeof import("../../components/ui/select/index")['SelectItemText']
  SelectLabel: typeof import("../../components/ui/select/index")['SelectLabel']
  SelectScrollDownButton: typeof import("../../components/ui/select/index")['SelectScrollDownButton']
  SelectScrollUpButton: typeof import("../../components/ui/select/index")['SelectScrollUpButton']
  SelectSeparator: typeof import("../../components/ui/select/index")['SelectSeparator']
  SelectTrigger: typeof import("../../components/ui/select/index")['SelectTrigger']
  SelectValue: typeof import("../../components/ui/select/index")['SelectValue']
  Hero: typeof import("../../components/Hero.vue")['default']
  InspirationWall: typeof import("../../components/InspirationWall.vue")['default']
  Navbar: typeof import("../../components/Navbar.vue")['default']
  QuoteTool: typeof import("../../components/QuoteTool.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  ColorScheme: typeof import("../../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue")['default']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyBadge: LazyComponent<typeof import("../../components/ui/badge/index")['Badge']>
  LazyButton: LazyComponent<typeof import("../../components/ui/button/index")['Button']>
  LazyCard: LazyComponent<typeof import("../../components/ui/card/index")['Card']>
  LazyCardContent: LazyComponent<typeof import("../../components/ui/card/index")['CardContent']>
  LazyCardDescription: LazyComponent<typeof import("../../components/ui/card/index")['CardDescription']>
  LazyCardFooter: LazyComponent<typeof import("../../components/ui/card/index")['CardFooter']>
  LazyCardHeader: LazyComponent<typeof import("../../components/ui/card/index")['CardHeader']>
  LazyCardTitle: LazyComponent<typeof import("../../components/ui/card/index")['CardTitle']>
  LazyInput: LazyComponent<typeof import("../../components/ui/input/index")['Input']>
  LazyLabel: LazyComponent<typeof import("../../components/ui/label/index")['Label']>
  LazySelect: LazyComponent<typeof import("../../components/ui/select/index")['Select']>
  LazySelectContent: LazyComponent<typeof import("../../components/ui/select/index")['SelectContent']>
  LazySelectGroup: LazyComponent<typeof import("../../components/ui/select/index")['SelectGroup']>
  LazySelectItem: LazyComponent<typeof import("../../components/ui/select/index")['SelectItem']>
  LazySelectItemText: LazyComponent<typeof import("../../components/ui/select/index")['SelectItemText']>
  LazySelectLabel: LazyComponent<typeof import("../../components/ui/select/index")['SelectLabel']>
  LazySelectScrollDownButton: LazyComponent<typeof import("../../components/ui/select/index")['SelectScrollDownButton']>
  LazySelectScrollUpButton: LazyComponent<typeof import("../../components/ui/select/index")['SelectScrollUpButton']>
  LazySelectSeparator: LazyComponent<typeof import("../../components/ui/select/index")['SelectSeparator']>
  LazySelectTrigger: LazyComponent<typeof import("../../components/ui/select/index")['SelectTrigger']>
  LazySelectValue: LazyComponent<typeof import("../../components/ui/select/index")['SelectValue']>
  LazyHero: LazyComponent<typeof import("../../components/Hero.vue")['default']>
  LazyInspirationWall: LazyComponent<typeof import("../../components/InspirationWall.vue")['default']>
  LazyNavbar: LazyComponent<typeof import("../../components/Navbar.vue")['default']>
  LazyQuoteTool: LazyComponent<typeof import("../../components/QuoteTool.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyColorScheme: LazyComponent<typeof import("../../node_modules/@nuxtjs/color-mode/dist/runtime/component.vue")['default']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
