export const Logo = ({ isWhite = false }) => (
  <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="0"
      y="28"
      fontFamily="Poppins, sans-serif"
      fontSize="28"
      fontWeight="700"
      fill={isWhite ? 'white' : 'hsl(var(--foreground))'}
    >
      Jon
    </text>
    <circle cx="58" cy="23" r="5" fill="hsl(var(--primary))" />
    <text
      x="70"
      y="28"
      fontFamily="Poppins, sans-serif"
      fontSize="28"
      fontWeight="700"
      fill={isWhite ? 'white' : 'hsl(var(--foreground))'}
    >
      Branding
    </text>
  </svg>
);
