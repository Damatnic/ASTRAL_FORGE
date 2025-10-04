/**
 * Centralized error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
    this.name = 'UnauthorizedError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR')
    this.name = 'DatabaseError'
  }
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown): {
  error: string
  code?: string
  statusCode: number
} {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    console.error('Unhandled error:', error)
    return {
      error: error.message || 'Internal server error',
      statusCode: 500,
    }
  }

  console.error('Unknown error:', error)
  return {
    error: 'An unexpected error occurred',
    statusCode: 500,
  }
}

/**
 * Async error wrapper for API routes
 */
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      const errorResponse = handleApiError(error)
      throw new AppError(
        errorResponse.error,
        errorResponse.statusCode,
        errorResponse.code
      )
    }
  }
}

/**
 * Retry logic for flaky operations
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt))
      }
    }
  }

  throw lastError || new Error('Retry failed')
}

/**
 * Log errors to monitoring service (placeholder)
 */
export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error logged:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  })
  
  // In production, send to Sentry, LogRocket, etc.
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context })
  // }
}

