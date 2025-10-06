import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WorkoutNotes } from '@/components/workout-notes'
import { ToastProvider } from '@/components/toast'

// Mock fetch
global.fetch = jest.fn()

describe('WorkoutNotes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderWithToast = (component: React.ReactNode) => {
    return render(
      <ToastProvider>
        {component}
      </ToastProvider>
    )
  }

  it('should render toggle button initially', () => {
    renderWithToast(<WorkoutNotes sessionId="test-session" />)
    
    expect(screen.getByText(/Add Workout Notes/i)).toBeInTheDocument()
  })

  it('should show form when toggle button is clicked', async () => {
    renderWithToast(<WorkoutNotes sessionId="test-session" />)
    
    const toggleBtn = screen.getByText(/Add Workout Notes/i)
    await userEvent.click(toggleBtn)
    
    expect(screen.getByText(/How was your workout/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Energy Level/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Sleep Quality/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Stress Level/i)).toBeInTheDocument()
  })

  it('should allow selecting energy level', async () => {
    renderWithToast(<WorkoutNotes sessionId="test-session" />)
    
    await userEvent.click(screen.getByText(/Add Workout Notes/i))
    
    const energyButton = screen.getByRole('button', { name: '9' })
    await userEvent.click(energyButton)
    
    expect(screen.getByText(/Excellent/i)).toBeInTheDocument()
  })

  it('should add quick tags to notes', async () => {
    renderWithToast(<WorkoutNotes sessionId="test-session" />)
    
    await userEvent.click(screen.getByText(/Add Workout Notes/i))
    
    const tagButton = screen.getByText('💪 Felt Strong')
    await userEvent.click(tagButton)
    
    const textarea = screen.getByPlaceholderText(/How did you feel/i) as HTMLTextAreaElement
    expect(textarea.value).toContain('💪 Felt Strong')
  })

  it('should save notes successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', content: 'Test notes' })
    })

    const onSave = jest.fn()
    renderWithToast(<WorkoutNotes sessionId="test-session" onSave={onSave} />)
    
    await userEvent.click(screen.getByText(/Add Workout Notes/i))
    
    const textarea = screen.getByPlaceholderText(/How did you feel/i)
    await userEvent.type(textarea, 'Great workout today!')
    
    const saveButton = screen.getByText('Save Notes')
    await userEvent.click(saveButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/sessions/test-session/notes',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('Great workout today!')
        })
      )
      expect(onSave).toHaveBeenCalled()
    })
  })

  it('should handle save error gracefully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400
    })

    renderWithToast(<WorkoutNotes sessionId="test-session" />)
    
    await userEvent.click(screen.getByText(/Add Workout Notes/i))
    await userEvent.click(screen.getByText('Save Notes'))
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to save notes/i)).toBeInTheDocument()
    })
  })

  it('should display different energy level labels', async () => {
    renderWithToast(<WorkoutNotes sessionId="test-session" />)
    
    await userEvent.click(screen.getByText(/Add Workout Notes/i))
    
    // Test different energy levels
    const lowEnergy = screen.getAllByRole('button', { name: '2' })[0]
    await userEvent.click(lowEnergy)
    expect(screen.getByText(/Low/i)).toBeInTheDocument()
    
    const moderateEnergy = screen.getAllByRole('button', { name: '5' })[0]
    await userEvent.click(moderateEnergy)
    expect(screen.getByText(/Moderate/i)).toBeInTheDocument()
    
    const goodEnergy = screen.getAllByRole('button', { name: '8' })[0]
    await userEvent.click(goodEnergy)
    expect(screen.getByText(/Good/i)).toBeInTheDocument()
  })

  it('should allow input of pre-workout nutrition', async () => {
    renderWithToast(<WorkoutNotes sessionId="test-session" />)
    
    await userEvent.click(screen.getByText(/Add Workout Notes/i))
    
    const nutritionInput = screen.getByPlaceholderText(/What did you eat/i)
    await userEvent.type(nutritionInput, 'Banana and coffee')
    
    expect((nutritionInput as HTMLInputElement).value).toBe('Banana and coffee')
  })
})

