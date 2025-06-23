import { render, screen, waitFor } from '@testing-library/react';
import Homepage from '../pages/index';

// Mock the API functions
jest.mock('../lib/airtable', () => ({
  getCrewsWithImages: jest.fn(),
  getGlobalStatistics: jest.fn(),
}));

describe('Homepage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing with empty data', () => {
    render(<Homepage featuredCrews={[]} statistics={{}} recentCrews={[]} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('displays error banner when hasError is true', () => {
    render(<Homepage hasError={true} />);
    expect(screen.getByText(/failed to load initial data/i)).toBeInTheDocument();
  });

  test('handles missing props gracefully', () => {
    render(<Homepage />);
    // Should not crash and should render basic structure
    expect(document.body).toBeInTheDocument();
  });
});