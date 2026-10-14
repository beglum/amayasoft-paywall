export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  typescript: { strict: true, typeCheck: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Переопределяется в рантайме через NUXT_DATABASE_URL (или DATABASE_URL — см. server/utils/db.ts)
    databaseUrl: '',
    public: {
      // Демо-панель ⚙ для ревью; NUXT_PUBLIC_DEMO_PANEL=false выключает её в боевом webview
      demoPanel: true,
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Зверята — подписка',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#fff8ee' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap' },
      ],
    },
  },
})
