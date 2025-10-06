import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  DatabaseError,
  handleApiError,
  asyncHandler,
  retry,
} from '@/lib/error-handler'

describe('Error Handler', () => {
  describe('AppError', () => {
    it('should create AppError with message and status code', () => {
      const error = new AppError('Test error', 500)
      
      expect(error.message).toBe('Test error')
      expect(error.statusCode).toBe(500)
      expect(error.name).toBe('AppError')
    })

    it('should create AppError with code', () => {
      const error = new AppError('Test error', 400, 'TEST_CODE')
      
      expect(error.code).toBe('TEST_CODE')
    })
  })

  describe('ValidationError', () => {
    it('should create ValidationError with 400 status', () => {
      const error = new ValidationError('Invalid input')
      
      expect(error.message).toBe('Invalid input')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('NotFoundError', () => {
    it('should create NotFoundError with 404 status', () => {
      const error = new NotFoundError('User')
      
      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
    })
  })

  describe('UnauthorizedError', () => {
    it('should create UnauthorizedError with 401 status', () => {
      const error = new UnauthorizedError()
      
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('DatabaseError', () => {
    it('should create DatabaseError with 500 status', () => {
      const error = new DatabaseError('Connection failed')
      
      expect(error.message).toBe('Connection failed')
      expect(error.statusCode).toBe(500)
      expect(error.code).toBe('DATABASE_ERROR')
    })
  })

  describe('handleApiError', () => {
    it('should handle AppError', () => {
      const error = new ValidationError('Invalid data')
      const result = handleApiError(error)
      
      expect(result.error).toBe('Invalid data')
      expect(result.statusCode).toBe(400)
      expect(result.code).toBe('VALIDATION_ERROR')
    })

    it('should handle generic Error', () => {
      const error = new Error('Something went wrong')
      const result = handleApiError(error)
      
      expect(result.error).toBe('Something went wrong')
      expect(result.statusCode).toBe(500)
    })

    it('should handle unknown error', () => {
      const result = handleApiError('string error')
      
      expect(result.error).toBe('An unexpected error occurred')
      expect(result.statusCode).toBe(500)
    })
  })

  describe('asyncHandler', () => {
    it('should handle successful async function', async () => {
      const fn = asyncHandler(async (value: number) => {
        return value * 2
      })
      
      const result = await fn(5)
      expect(result).toBe(10)
    })

    it('should catch and rethrow errors', async () => {
      const fn = asyncHandler(async () => {
        throw new Error('Test error')
      })
      
      await expect(fn()).rejects.toThrow(AppError)
    })
  })

  describe('retry', () => {
    it('should succeed on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success')
      
      const result = await retry(fn, 3, 100)
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should retry and eventually succeed', async () => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success')
      
      const result = await retry(fn, 3, 10)
      
      expect(result).toBe('success')
      expect(fn).toHaveBeenCalledTimes(3)
    })

    it('should throw after max attempts', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('persistent failure'))
      
      await expect(retry(fn, 3, 10)).rejects.toThrow('persistent failure')
      expect(fn).toHaveBeenCalledTimes(3)
    })
  })
})


