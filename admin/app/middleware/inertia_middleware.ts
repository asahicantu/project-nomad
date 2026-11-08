import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'
import { SystemService } from '#services/system_service'
import { getAiAssistantName } from '#config/inertia'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  /**
   * Data shared with all rendered pages
   */
  share(_ctx: HttpContext) {
    return {
      appVersion: () => SystemService.getAppVersion(),
      environment: process.env.NODE_ENV || 'production',
      aiAssistantName: () => getAiAssistantName(),
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)

    const output = await next()
    this.dispose(ctx)

    return output
  }
}

declare module '@adonisjs/inertia/types' {
  type MiddlewareSharedProps = InferSharedProps<InertiaMiddleware>
  export interface SharedProps extends MiddlewareSharedProps {}
}
