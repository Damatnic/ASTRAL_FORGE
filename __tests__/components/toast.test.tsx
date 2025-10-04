import { render, screen, act, waitFor } from '@testing-library/react'
import { ToastProvider, useToast } from '@/components/toast'
import { ReactNode } from 'react'

// Test component that uses the toast hook
function TestComponent() {
  const { showToast } = useToast()
  
  return (
    <div>
      <button onClick={() => showToast('Test message', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info
      </button>
    </div>
  )
}

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render toast provider without crashing', () => {
    render(
      <ToastProvider>
        <div>Test</div>
      </ToastProvider>
    )
    
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should show success toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Show Success').click()
    })

    expect(screen.getByText('Test message')).toBeInTheDocument()
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('should show error toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Show Error').click()
    })

    expect(screen.getByText('Error message')).toBeInTheDocument()
    // There are multiple ✕ elements (icon and close button)
    expect(screen.getAllByText('✕')).toHaveLength(2)
  })

  it('should auto-dismiss toast after 3 seconds', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )

    act(() => {
      screen.getByText('Show Info').click()
    })

    expect(screen.getByText('Info message')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    await waitFor(() => {
      expect(screen.queryByText('Info message')).not.toBeInTheDocument()
    })
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    expect(() => {
      function InvalidComponent() {
        useToast()
        return null
      }
      render(<InvalidComponent />)
    }).toThrow('useToast must be used within ToastProvider')

    consoleSpy.mockRestore()
  })
})

