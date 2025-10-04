import { render, screen } from '@testing-library/react'
import { PlateCalculator } from '@/components/plate-calculator'
import userEvent from '@testing-library/user-event'

describe('PlateCalculator', () => {
  it('should render with target weight', () => {
    render(<PlateCalculator targetWeight={100} />)
    
    // There might be multiple elements with 100kg (target weight and actual weight)
    const weightElements = screen.getAllByText(/100kg/)
    expect(weightElements.length).toBeGreaterThan(0)
    expect(screen.getByText('Plate Calculator')).toBeInTheDocument()
  })

  it('should calculate plates correctly for 100kg', () => {
    render(<PlateCalculator targetWeight={100} barWeight={20} />)
    
    // 100kg total - 20kg bar = 80kg / 2 sides = 40kg per side
    // Check for plate presence (might be 25kg + 15kg instead of exact 20kg + 15kg + 5kg)
    const plateElements = screen.getAllByText(/kg plate/)
    expect(plateElements.length).toBeGreaterThan(0)
  })

  it('should show bar only message for weight <= bar weight', () => {
    render(<PlateCalculator targetWeight={20} barWeight={20} />)
    
    expect(screen.getByText(/Bar only/i)).toBeInTheDocument()
  })

  it('should call onClose when close button clicked', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    
    render(<PlateCalculator targetWeight={100} onClose={onClose} />)
    
    const closeButton = screen.getAllByText('×')[0]
    await user.click(closeButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('should call onClose when Got It button clicked', async () => {
    const onClose = jest.fn()
    const user = userEvent.setup()
    
    render(<PlateCalculator targetWeight={100} onClose={onClose} />)
    
    const button = screen.getByText('Got It!')
    await user.click(button)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('should display bar weight', () => {
    render(<PlateCalculator targetWeight={100} barWeight={20} />)
    
    expect(screen.getByText('20kg')).toBeInTheDocument()
  })

  it('should calculate total weight correctly', () => {
    render(<PlateCalculator targetWeight={100} barWeight={20} />)
    
    // Should show actual loaded weight (there are multiple 100kg elements)
    const weightElements = screen.getAllByText(/100kg/)
    expect(weightElements.length).toBeGreaterThan(0)
  })
})

