import { render, screen } from '@testing-library/react';
import ComponentErrorBoundary from '../components/ComponentErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ComponentErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('catches errors and displays fallback UI', () => {
    render(
      <ComponentErrorBoundary>
        <ThrowError />
      </ComponentErrorBoundary>
    );

    expect(screen.getByText(/unable to load this section/i)).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  test('renders children when no error occurs', () => {
    render(
      <ComponentErrorBoundary>
        <div>Test content</div>
      </ComponentErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});