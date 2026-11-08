import env from '#start/env'
import { defineConfig, drivers } from '@adonisjs/core/encryption'

/**
 * The legacy driver keeps data encrypted by AdonisJS 6 (cookies, signed
 * URLs, encrypted values) readable after the v7 upgrade.
 */
export default defineConfig({
  default: 'legacy',
  list: {
    legacy: drivers.legacy({
      keys: [env.get('APP_KEY')],
    }),
  },
})
