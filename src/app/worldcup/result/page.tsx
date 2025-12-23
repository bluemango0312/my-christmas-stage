'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Stage } from '../../../lib/worldcup/types';
import { inter } from '@/lib/fonts';

const BG = '/worldcup-result-bg.png';
const LOGO = '/worldcup-result-logo.png';

// 아이콘 배열
const PIXEL_ICONS = Array.from(
    { length: 35 },
    (_, i) => `/pixel/pixel-${i + 1}.png`
);

// 픽셀 아이콘 랜덤 뽑기
function pickIconsRandom(count: number) {
    const pool = [...PIXEL_ICONS];

    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    return pool.slice(0, count);
}


export default function WorldcupResultPage() {
    const [icons, setIcons] = useState<string[]>([]); // top3 카드에 사용할 랜덤 픽셀 아이콘
    const [top3, setTop3] = useState<Stage[]>([]); // 결과 데이터
    const captureRef = useRef<HTMLDivElement | null>(null); // save as image에서 캡쳐할 영역 ref
    const [isCapturing, setIsCapturing] = useState(false);

    // 더미 데이터
    const injectTestTop3 = () => {
        const mock: Stage[] = [
            { id: 'test-1', title: 'Beautiful Christmas', artist: 'Red Velvet X aespa', youtubeId: 'KrM6qosTwp8' },
            { id: 'test-2', title: 'All I Want For Christmas Is You', artist: '소녀시대', youtubeId: '005kh2-GFAM' },
            { id: 'test-3', title: '첫 눈', artist: 'EXO', youtubeId: 'zAnWZmPsCnk' },
        ];

        sessionStorage.setItem('worldcup_top3', JSON.stringify(mock));
        setTop3(mock);
        setIcons(pickIconsRandom(mock.length));
    };


    // 최초 진입 시 top3 데이터를 sessionStorage에서 읽고, top3 개수만큼 아이콘 랜덤 생성
    useEffect(() => {
        try {
            const raw = sessionStorage.getItem('worldcup_top3');
            if (!raw) {
                setTop3([]);
                setIcons([]);
                return;
            }

            const parsed = JSON.parse(raw) as Stage[];
            const top = parsed.slice(0, 3);

            setTop3(top);

            //아이콘 랜덤 생성
            setIcons(pickIconsRandom(top.length));
        } catch {
            setTop3([]);
            setIcons([]);
        }
    }, []);

    // 공유 버튼
    // 팝업 띄우기 로직 추가

    // Save as Image
    // captureRef 영역만 html2canvas로 캡쳐
    // PNG 파일로 다운로드
    const saveAsImage = async () => {
        if (top3.length > 0 && icons.length !== top3.length) return;

        setIsCapturing(true);

        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

        const el = captureRef.current;
        if (!el) {
            setIsCapturing(false);
            return;
        }

        const waitForImages = async (root: HTMLElement) => {
            const imgs = Array.from(root.querySelectorAll('img')) as HTMLImageElement[];

            await Promise.all(
                imgs.map((img) => {
                    if (img.complete && img.naturalWidth > 0) return Promise.resolve();

                    return new Promise<void>((resolve) => {
                        const done = () => resolve();
                        img.addEventListener('load', done, { once: true });
                        img.addEventListener('error', done, { once: true });
                    });
                })
            );
        };

        await waitForImages(el);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

        const { default: html2canvas } = await import('html2canvas');
        await (document as any).fonts?.ready;

        const canvas = await html2canvas(el, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 0,

            width: el.scrollWidth,
            height: el.scrollHeight,
            windowWidth: el.scrollWidth,
            windowHeight: el.scrollHeight,
        });

        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-christmas-stage-top3.png';
        a.click();

        setIsCapturing(false);
    };

    const absUrl = (path: string) =>
        typeof window === 'undefined' ? path : new URL(path, window.location.origin).toString();

    return (
        <main className={`${inter.className} relative min-h-[100dvh] w-full bg-black`}>
            {/* 전체 배경 이미지 */}
            <img
                src={BG}
                alt="background"
                className="absolute inset-0 h-full w-full object-cover md:hidden"
                style={{ zIndex: 0 }}
            />

            {/* PC 바깥 여백용 단색 배경 */}
            <div
                className="absolute inset-0 hidden md:block"
                style={{ zIndex: 0, backgroundColor: '#5A1620' }}
            />

            {/* 모바일 프레임 영역 */}
            <div className="relative z-10 mx-auto min-h-[100dvh] w-full overflow-hidden md:max-w-[390px] [container-type:inline-size]">
                <img
                    src={BG}
                    alt="home background"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ zIndex: 0 }}
                />

                <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-6 pt-14 pb-10">
                    {/* 상단 로고 (UI용 그대로) */}
                    <img
                        src={LOGO}
                        alt="My Christmas Stage TopPicks"
                        className="
                        w-[clamp(220px,70cqw,520px)]
                        select-none
                        pointer-events-none
                        mt-[clamp(24px,25cqw,150px)]
                    "
                    />

                    {/* Top3 카드 영역 (UI는 기존 유지, 캡처는 이 영역이 아니라 '캡처 전용 DOM'을 쓸 거라 ref는 여기서 빼도 됨)
            그래도 네 코드 유지하려면 ref는 둬도 되고, 캡처 시엔 다른 ref를 쓰면 됨 */}
                    <div className="mt-5 w-[clamp(260px,92cqw,350px)]">
                        <div className="flex flex-col items-center gap-4">
                            {top3.length === 0 ? (
                                <div className="text-[rgba(255,255,255,0.7)] text-[13px] text-center">
                                    결과를 불러오지 못했어.<br />다시 한 번 플레이해줘!
                                </div>
                            ) : (
                                top3.map((s, i) => (
                                    <div
                                        key={s.id}
                                        className="
                                            rounded-[22px]
                                            bg-[rgba(255,255,255,0.9)]
                                            px-[clamp(10px,10cqw,25px)]
                                            py-[clamp(10px,5cqw,16px)]
                                            w-[clamp(170px,75cqw,350px)]
                                            shadow-[0_0px_30px_rgba(225,225,225,0.35)]
                                        "
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[rgba(0,0,0,0.9)] text-[18px] font-semibold truncate">
                                                    {s.title}
                                                </div>

                                                <div className="flex items-center gap-2 text-[rgba(0,0,0,0.7)] text-[14px] min-w-0">
                                                    <span>🎤</span>
                                                    <span className="truncate">{s.artist}</span>
                                                </div>
                                            </div>

                                            <img
                                                src={icons[i]}
                                                alt="pixel icon"
                                                className="w-10 h-10"
                                                style={{ imageRendering: 'pixelated' }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 이미지 저장 버튼 */}
                    <button
                        type="button"
                        onClick={saveAsImage}
                        className="
                            mt-10
                            text-[rgba(255,255,255,0.8)]
                            text-[14px]
                            tracking-wide
                            hover:text-[rgba(255,255,255,0.95)]
                            transition
                        "
                    >
                        Save as Image
                    </button>

                    {/* 공유 버튼 */}
                    <div
                        className="
                            fixed
                            bottom-[clamp(24px,6vh,72px)]
                            left-1/2
                            -translate-x-1/2
                            w-[clamp(240px,70cqw,320px)]
                            z-50
                        "
                    >
                        <button
                            type="button"
                            className="
                                rounded-3xl
                                bg-[#C13939]
                                border-2
                                block
                                mx-auto
                                border-[#147529]
                                px-6 py-1
                                text-white
                                font-normal tracking-wide
                                text-[clamp(10px,5.5cqw,40px)]
                                shadow-[0_0_30px_0_rgba(20,117,41,1)]
                                active:scale-95
                                transition
                                mb-[clamp(32px,6.8vh,72px)]
                                "
                        >
                            Share
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={injectTestTop3}
                        className="
                            mt-4
                            w-full
                            rounded-[999px]
                            border
                            border-[rgba(255,255,255,0.2)]
                            bg-[rgba(255,255,255,0.10)]
                            py-2.5
                            text-[rgba(255,255,255,0.8)]
                            text-[14px]
                            hover:bg-[rgba(255,255,255,0.15)]
                            transition
                        "
                    >
                        테스트 데이터 넣기
                    </button>
                </div>
            </div>

            {/* 저장할 때만 렌더되는 '캡처 전용 DOM' (화면엔 안 보임) */}
            {isCapturing && (
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{ zIndex: -10 }}
                    aria-hidden="true"
                >

                    <div
                        ref={captureRef}
                        className="
                            w-[390px]
                            rounded-[28px]
                            p-6
                        "
                        style={{
                            backgroundColor: '#8B1F2C',
                            backgroundImage:
                                'radial-gradient(120% 90% at 50% 10%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 55%), radial-gradient(120% 100% at 50% 110%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 55%)',
                        }}
                    >

                        {/* 로고 (캡처에만 포함) */}
                        <img
                            src={absUrl(LOGO)}
                            alt="My Christmas Stage TopPicks"
                            crossOrigin="anonymous"
                            className="mx-auto w-[320px] select-none pointer-events-none"
                        />

                        {/* 카드 (캡처에서는 잘림 없이) */}
                        <div className="mt-5 flex flex-col gap-4">
                            {top3.length === 0 ? (
                                <div className="text-[rgba(255,255,255,0.7)] text-[13px] text-center">
                                    결과를 불러오지 못했어.<br />다시 한 번 플레이해줘!
                                </div>
                            ) : (
                                top3.map((s, i) => (
                                    <div
                                        key={`capture-${s.id}`}
                                        className="
                                            w-full
                                            rounded-[22px]
                                            bg-[rgba(255,255,255,0.92)]
                                            px-6
                                            pb-6
                                            pt-2
                                            shadow-[0_0px_30px_rgba(225,225,225,0.20)]
                                        "
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[rgba(0,0,0,0.9)] text-[18px] font-semibold truncate py-[4px]">
                                                    {s.title}
                                                </div>

                                                <div className="flex items-center gap-2 text-[rgba(0,0,0,0.7)] text-[14px] min-w-0">
                                                    <span>🎤</span>
                                                    <span className="truncate leading-[1.35] inline-block py-[10px]">
                                                        {s.artist}
                                                    </span>
                                                </div>
                                            </div>
                                            <img
                                                src={absUrl(icons[i])}
                                                alt="pixel icon"
                                                crossOrigin="anonymous"
                                                className="w-10 h-10"
                                                style={{ imageRendering: 'pixelated' }}
                                            />

                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );

}