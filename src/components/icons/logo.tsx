export const Logo = ({ isWhite = false }) => (
  <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="0"
      y="28"
      fontFamily="Poppins, sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill={isWhite ? 'hsl(var(--card-foreground))' : 'hsl(var(--primary-foreground))'}
    >
      Jon.
      <tspan fill={isWhite ? 'hsl(var(--secondary))' : 'hsl(var(--primary))'}>Branding</tspan>
    </text>
  </svg>
);
