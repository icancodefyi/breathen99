import Image from 'next/image';

export default function Curtain() {
  return (
    <div id="curtain">
      <Image src="/assets/logo-white.jpg" id="curtain-logo" alt="breathEN" width={200} height={60} />
    </div>
  );
}
