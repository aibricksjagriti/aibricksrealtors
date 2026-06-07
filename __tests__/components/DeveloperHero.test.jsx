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
    const images = screen.getAllByAltText('Godrej');
    const srcs = images.map((img) => img.getAttribute('src'));
    expect(srcs).toContain('/banners/godrej.jpg');
    expect(srcs).toContain('/logos/godrej.png');
  });

  test('renders premium developer badge', () => {
    render(<DeveloperHero builderName="Godrej" projects={[]} developer={developer} />);
    expect(screen.getByText(/Premium Developer/)).toBeInTheDocument();
  });

  test('shows project count in stats card', () => {
    render(<DeveloperHero builderName="Godrej" projects={[{}, {}, {}]} developer={developer} />);
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('Explore Projects')).toHaveAttribute('href', '#projects');
  });

  test('shows zero projects in stats card when none exist', () => {
    render(<DeveloperHero builderName="Godrej" projects={[]} developer={developer} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
  });

  test('uses fallback banner and tagline when developer data is missing', () => {
    render(<DeveloperHero builderName="Godrej" projects={[]} developer={null} />);
    const images = screen.getAllByAltText('Godrej');
    expect(images).toHaveLength(1); // banner only, no logo
    expect(images[0]).toHaveAttribute('src', '/developers/kolt_wagoh.jpg');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Godrej Projects');
  });

  test('opens lead capture modal on Get Details click', () => {
    render(<DeveloperHero builderName="Godrej" projects={[]} developer={developer} />);
    expect(screen.queryByTestId('lead-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Get Details'));
    expect(screen.getByTestId('lead-modal')).toHaveTextContent('Enquire about Godrej');
  });
});
