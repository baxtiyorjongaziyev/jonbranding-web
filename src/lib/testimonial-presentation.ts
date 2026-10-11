export function presentTestimonial<T extends { company: string; quote: string; videoUrl?: string; videoFileUrl?: string }>(testimonial: T): T {
  // Video summaries and these existing editorial captions are not direct quotes.
  if (testimonial.videoUrl || testimonial.videoFileUrl || /Azel Shoes|Sunnah Products/i.test(testimonial.company)) {
    return { ...testimonial, quote: '' };
  }
  return testimonial;
}
