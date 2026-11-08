import KVStore from '#models/kv_store'
import { defineConfig } from '@adonisjs/inertia'

let _assistantNameCache: { value: string; expiresAt: number } | null = null

export function invalidateAssistantNameCache() {
  _assistantNameCache = null
}

/**
 * Assistant name shared with every page (see app/middleware/inertia_middleware.ts),
 * cached for a minute so each render doesn't hit the KV store.
 */
export async function getAiAssistantName(): Promise<string> {
  const now = Date.now()
  if (_assistantNameCache && now < _assistantNameCache.expiresAt) {
    return _assistantNameCache.value
  }
  const customName = await KVStore.getValue('ai.assistantCustomName')
  const value = (customName && customName.trim()) ? customName : 'AI Assistant'
  _assistantNameCache = { value, expiresAt: now + 60_000 }
  return value
}

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/ssr.tsx'
  }
})

export default inertiaConfig
