import { render, screen, fireEvent } from '@testing-library/react';
import SeoFieldsSection from '@/src/admin/components/SeoFieldsSection';

describe('SeoFieldsSection (admin panel SEO editor)', () => {
  const values = {
    metaTitle: 'My Title',
    metaDescription: 'My description',
    metaKeywords: 'a, b',
    canonicalUrl: 'https://example.com/page',
  };

  test('renders all four SEO inputs with values', () => {
    render(<SeoFieldsSection values={values} onChange={() => {}} />);
    expect(screen.getByDisplayValue('My Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('My description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('a, b')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com/page')).toBeInTheDocument();
    expect(screen.getByText('Meta Title')).toBeInTheDocument();
    expect(screen.getByText('Meta Description')).toBeInTheDocument();
    expect(screen.getByText('Meta Keywords')).toBeInTheDocument();
    expect(screen.getByText('Canonical URL')).toBeInTheDocument();
  });

  test('shows character counters', () => {
    render(<SeoFieldsSection values={values} onChange={() => {}} />);
    expect(screen.getByText('8/60 characters recommended')).toBeInTheDocument();
    expect(screen.getByText('14/160 characters recommended')).toBeInTheDocument();
  });

  test('calls onChange with the field name and value', () => {
    const onChange = jest.fn();
    render(<SeoFieldsSection values={values} onChange={onChange} />);
    fireEvent.change(screen.getByDisplayValue('My Title'), {
      target: { name: 'metaTitle', value: 'New Title' },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('renders safely with empty values', () => {
    render(<SeoFieldsSection values={{}} onChange={() => {}} />);
    expect(screen.getByText('0/60 characters recommended')).toBeInTheDocument();
    expect(screen.getByText('0/160 characters recommended')).toBeInTheDocument();
  });

  test('renders safely with undefined values prop', () => {
    render(<SeoFieldsSection onChange={() => {}} />);
    expect(screen.getByText('Meta Title')).toBeInTheDocument();
  });
});
