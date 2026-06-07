import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: jest.fn(), push: jest.fn() }),
}));

import Navbar from '@/src/Home/Navbar';
import Footer from '@/src/Footer';

describe('Site branding (logo)', () => {
  test('Navbar renders the AI Bricks logo image', () => {
    render(<Navbar />);
    const logos = screen.getAllByAltText('logo');
    expect(logos.length).toBeGreaterThanOrEqual(1);
    expect(logos[0]).toHaveAttribute('src', '/aibricks-logo-2.png');
  });

  test('Navbar logo links to the homepage', () => {
    render(<Navbar />);
    const logo = screen.getAllByAltText('logo')[0];
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  test('Footer renders the AI Bricks logo image', () => {
    render(<Footer />);
    const logos = screen.getAllByAltText('logo');
    expect(logos.length).toBeGreaterThanOrEqual(1);
    expect(logos[0]).toHaveAttribute('src', '/aibricks-logo-2.png');
  });

  test('Navbar still renders all primary navigation links', () => {
    render(<Navbar />);
    ['HOME', 'ABOUT', 'PROPERTIES', 'DEVELOPERS', 'LOCATIONS', 'CONTACT'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
