import { render, screen } from '@testing-library/react'
import PranaLogo3 from '../PranaLogo3'

describe('PranaLogo3', () => {
  it('renders the logo', () => {
    render(<PranaLogo3 />)
    const logo = screen.getByRole('img', { hidden: true }) // SVG is considered an img
    expect(logo).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<PranaLogo3 className="custom-class" />)
    const logo = screen.getByRole('img', { hidden: true })
    expect(logo).toHaveClass('custom-class')
  })

  it('applies pulse animation when pulse is true', () => {
    render(<PranaLogo3 pulse={true} />)
    const logo = screen.getByRole('img', { hidden: true })
    expect(logo).toHaveClass('animate-[pulse_4s_ease-in-out_infinite]')
  })
})