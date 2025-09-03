import Image from 'next/image';

export const Logo = ({ isWhite = false }) => (
    <Image
      src="https://img4.teletype.in/files/fc/d0/fcd09308-b559-4818-8570-dc078bfa0915.png"
      alt="Jon.Branding Logo"
      width={160}
      height={32}
      className={isWhite ? 'filter brightness-0 invert' : ''}
      priority
    />
);
