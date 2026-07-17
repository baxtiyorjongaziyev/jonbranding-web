import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProcessVideo from './process-video';

vi.mock('next/image', () => ({
  default: ({ fill: _fill, alt = '', ...props }: any) => <img alt={alt} {...props} />,
}));

const dictionary = {
  eyebrow: 'Jarayon',
  title: "Biz qanday ishlashimizni ko'ring",
  description: 'Jarayon tavsifi',
  play: "Jarayon videosini ko'rish",
  posterAlt: 'Jarayon videosi muqovasi',
  fallbackHint: "Video ochilmasa, matnni ko'ring.",
  fallbackCta: "Jarayonni matnda ko'rish",
  iframeTitle: 'Jon.Branding jarayon videosi',
};

describe('ProcessVideo Vimeo facade', () => {
  it('loads Vimeo only after consentful interaction and keeps a text fallback visible', () => {
    render(<ProcessVideo dictionary={dictionary} />);

    expect(screen.queryByTitle(dictionary.iframeTitle)).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: dictionary.posterAlt })).toBeInTheDocument();
    const fallback = screen.getByRole('link', { name: /Jarayonni matnda ko'rish/ });
    expect(fallback).toHaveAttribute('href', '#process');

    fireEvent.click(screen.getByRole('button', { name: dictionary.play }));

    const iframe = screen.getByTitle(dictionary.iframeTitle);
    expect(iframe).toHaveAttribute('src', expect.stringContaining('dnt=1'));
    expect(iframe).not.toHaveAttribute('src', expect.stringContaining('background=1'));
    expect(screen.getByRole('link', { name: /Jarayonni matnda ko'rish/ })).toBeInTheDocument();
  });
});
