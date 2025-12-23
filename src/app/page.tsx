import Link from 'next/link';
import { inter } from '@/lib/fonts';
import { inglesa } from '@/lib/fonts';
import { berlin } from '@/lib/fonts';


type Decor = {
  src: string;
  alt: string;

  // 위치/크기/레이어 조절용
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;

  width?: number | string;
  height?: number | string;

  opacity?: number;
  zIndex?: number;

  // rotate(회전), scale(확대) 같은 변형
  rotateDeg?: number;
  scale?: number;
};

// 숫자면 px로 처리, string이면 그대로 사용(예: '10%', '2rem')
const toCssValue = (v?: number | string) => (typeof v === 'number' ? `${v}px` : v);

const HOME_BG = '/home-bg.png';

// 여기서 장식들 위치/크기만 계속 만지면 됨
const DECORS: Decor[] = [
  {
    src: '/home-ribbon-dot.png',
    alt: 'ribbon dots',
    top: 0,
    left: 0,
    width: '30%',
    opacity: 1,
    zIndex: 2,
  },
  {
    src: '/home-star-dot.png',
    alt: 'star dots',
    bottom: 0,
    left: 0,
    width: '58%',
    opacity: 1,
    zIndex: 3,
  },
  {
    src: '/home-stars-dot.png',
    alt: 'stars dots',
    bottom: '30cqw',
    right: '8.2cqw',
    width: '22%',
    opacity: 1,
    zIndex: 4,
  },
  {
    src: '/home-sparkle-text.png',
    alt: 'sparkle text',
    top: '50cqw',
    left: '3.6cqw',
    width: '23%',
    opacity: 1,
    zIndex: 5,
  },
  {
    src: '/home-sparkle-text2.png',
    alt: 'sparkle text',
    top: '52.5cqw',
    right: '3.3cqw',
    width: '23%',
    opacity: 1,
    zIndex: 5,
  },
  // 필요하면 여기 아래에 계속 추가
  // { src: '/globe.svg', alt: 'globe', top: 40, left: 20, width: 120, height: 120, opacity: 0.9, zIndex: 6 }
];

export default function HomePage() {
  return (
    <main className="relative min-h-[100dvh] w-full bg-black">
      {/* 전체 화면 배경: 모바일에서는 이미지, PC에서는 숨김 */}
      <img
        src={HOME_BG}
        alt="full background"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
        style={{ zIndex: 0 }}
      />

      {/* PC 바깥 여백용 단색 배경 */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{ zIndex: 0, backgroundColor: '#3A0F14' }}
      />

      {/* 전체 오버레이 */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />

      {/* 폰 프레임 */}
      <div className="relative z-10 mx-auto min-h-[100dvh] w-full overflow-hidden md:max-w-[390px] [container-type:inline-size]">
        {/* 폰 프레임 안 배경은 계속 이미지 */}
        <img
          src={HOME_BG}
          alt="home background"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0 }}
        />

        {/* Decorations */}
        {DECORS.map((d) => (
          <img
            key={d.src}
            src={d.src}
            alt={d.alt}
            className="absolute pointer-events-none select-none max-w-none"
            style={{
              top: toCssValue(d.top),
              left: toCssValue(d.left),
              right: toCssValue(d.right),
              bottom: toCssValue(d.bottom),
              width: toCssValue(d.width),
              height: toCssValue(d.height),
              opacity: d.opacity ?? 1,
              zIndex: d.zIndex ?? 2,
              transform: `rotate(${d.rotateDeg ?? 0}deg) scale(${d.scale ?? 1})`,
              transformOrigin: 'center',
            }}
          />
        ))}

        {/* Content */}
        <div
          className="relative flex min-h-[100dvh] flex-col items-center justify-end px-6 pb-14"
          style={{ zIndex: 50 }}
        >
          { /* 타이틀 텍스트 */}
          <div
            className="
            absolute
            top-[14%]
            flex
            flex-col
            items-center
            leading-none
          "
          >
            <h1
              className={`
              ${inglesa.className}
              pointer-events-none
              text-[clamp(72px,27.5cqw,150px)]
              text-white/80
              whitespace-nowrap
              z-5
            `}
              style={{
                textShadow: '0px 0px 20px rgba(255, 255, 255, 0.8)',
              }}
            >
              Pick My
            </h1>

            <div className='relative mt-1'>
              <h1
                className={`
              ${berlin.className}
              text-[clamp(30px,11cqw,100px)]
              text-white
              -mt-2
              z-5
            `}
                style={{
                  textShadow: '0px 0px 20px rgba(255, 255, 255, 1)',
                }}
              >
                Christmas Stage
              </h1>

              <img
                src="/home-title-bg.png"
                alt="title decor"
                className="
                  pointer-events-none
                  select-none
                  absolute
                  left-1/2
                  top-1/2
                  -translate-x-1/2
                  -translate-y-1/2
                  w-[clamp(300px,100cqw,2000px)]
                  z-10
                  max-w-none
                "/>
            </div>

          </div>


          { /* START 버튼 */}
          <Link
            href="/worldcup/intro"
            className={`
              ${inter.className}
              rounded-3xl
              bg-[#C13939]
              border-2
              border-[#147529]
              px-6 py-1
              text-white
              font-normal tracking-wide
              text-[clamp(10px,5.5cqw,40px)]
              shadow-[0_0_30px_0_rgba(20,117,41,1)]
              active:scale-95
              transition
              mb-[clamp(32px,6.8vh,72px)]
              z-5
            `}
          >
            START
          </Link>

          { /* 저작권 텍스트 */}
          <div className={`
          mt-10
          ml-auto
          pr-1
          text-white/50
          text-[9px] s::text-[9px] md:text-[9px]
          translate-y-[clamp(0px,9cqw,100px)]
          z-50
          `}
          >
            © 2025 Jeonghu. All rights reserved.
          </div>
        </div>
      </div>
    </main>
  );
}
