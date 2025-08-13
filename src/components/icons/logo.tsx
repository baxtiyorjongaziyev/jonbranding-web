export const Logo = ({ isWhite = false }) => (
  <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text
      x="0"
      y="28"
      fontFamily="Poppins, sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill={isWhite ? '#FFFFFF' : '#050583'}
    >
      Jon.
      <tspan fill={isWhite ? '#ADFFFE' : '#00C9FD'}>Branding</tspan>
    </text>
  </svg>
);
