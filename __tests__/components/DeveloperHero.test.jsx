import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@/src/LeadCapture/LeadCaptureModal', () => ({ open, title }) =>
  open ? <div data-testid="lead-modal">{title}</div> : null
);

import DeveloperHero from '@/src/Developers/DeveloperHero';

describe('DeveloperHero (developer page banner)', () => {
  const developer = {
    name: 'Godrej',
    tagline: 'Godrej Premium Homes',
    banner: '/banners/godrej.jpg',
    logo: '/logos/godrej.png',
  };

  test('renders tagline as the main heading', () => {
    render(<DeveloperHero builderName="Godrej" projects={[{}, {}]} developer={developer} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Godrej Premium Homes');
  });

  test('renders developer logo and banner images', () => {
    render(<DeveloperHero builderName="Godrej" projects={[]} developer={developer} />);
    expect(screen.getByAltText('Godrej logo')).toHaveAttribute('src', '/logos/godrej.png');
    expect(screen.getByAltText('Godrej banner')).toHaveAttribute('src', '/banners/godrej.jpg');
  });

  test('shows project count when projects exist', () => {
    render(<DeveloperHero builderName="Godrej" projects={[{}, {}, {}]} developer={developer} />);
    expect(screen.getByText('3 Projects Available')).toBeInTheDocument();
    expect(screen.getByText('View Projects')).toHaveAttribute('href', '#projects');
  });

  test('shows coming soon when no projects', () => {
    render(<DeveloperHero builderName="Godrej" projects={[]} developer={developer} />);
    expect(screen.getByText(/Coming Soon/)).toBeInTheDocument();
    expect(screen.queryByText('View Projects')).not.toBeInTheDocument();
  });

  test('uses fallback banner and tagline when developer data is missing', () => {
    render(<DeveloperHero builderName="Godrej" projects={[]} developer={null} />);
    expect(screen.getByAltText('Godrej banner')).toHaveAttribute('src', '/developers/kolt_wagoh.jpg');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Godrej Projects');
    // no logo chip when developer has no logo
    expect(screen.queryByAltText('Godrej logo')).not.toBeInTheDocument();
  });

  test('opens lead capture modal on Get Details click', () => {
    render(<DeveloperHero builderName="Godrej" projects={[]} developer={developer} />);
    expect(screen.queryByTestId('lead-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Get Details'));
    expect(screen.getByTestId('lead-modal')).toHaveTextContent('Enquire about Godrej');
  });
});
