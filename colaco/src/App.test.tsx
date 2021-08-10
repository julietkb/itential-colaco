import { render, screen } from '@testing-library/react'
import App from './App'

describe('ColaCo virtual vending machine', () => {
  it('renders vending machine elements', () => {
    render(<App />)
    expect(screen.getByText("ColaCo")).toBeInTheDocument()
  })
})
