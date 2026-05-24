export const metadata = {
  title: 'Sanity Studio | Jon.Branding',
  description: 'Internal content workspace for Jon.Branding.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
