'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import type { Stage } from '../../../lib/worldcup/types';
import { inter } from '@/lib/fonts';
import { inglesa, berlin, Cafe24PROUP } from '@/lib/fonts';
import { useRouter } from 'next/navigation';

const BG = '/worldcup-bg.png';


function VideoCard({
    videoId,
    onPick,
    label = 'Pick!',
}: {
    videoId: string;
    onPick: () => void;
    label?: string;
}) {
    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <div className="relative w-full aspect-video bg-black">
                    <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            </div>

            <button
                type="button"
                onClick={onPick}
                className="
                    group
                    relative
                    mt-3
                    w-full
                    rounded-xl
                    border-2
                    border-[#C13939]/70
                    bg-[#2A0E10]/35
                    py-1.5

                    text-white/85
                    text-[clamp(13px,3.7cqw,18px)]
                    tracking-wide

                    shadow-[0_0_18px_rgba(193,57,57,0.5),inset_0_0_12px_rgba(193,57,57,0.1)]
                    active:scale-[0.97]
                    transition
                "
            >

                {/* 살짝 떠있는 느낌 */}
                <span
                    className="
                    relative
                    z-10
                    drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]
                    "
                >
                    🎄 {label}
                </span>
            </button>

        </div>
    );
}


export default function worldcupPlayPage() {
    const router = useRouter();

    // 필요한 상태
    const [loading, setLoading] = useState(true); // 로딩 중인지
    const [pool, setPool] = useState<Stage[]>([]); // 현재 라운드에 남아있는 참가자 배열
    const [index, setIndex] = useState(0); // 현재 매치 위치
    const [winners, setWinners] = useState<Stage[]>([]); // 이번 라운드 승자 모아두는 배열

    const roundSize = pool.length; //32, 16, 8
    const matchNo = Math.floor(index / 2) + 1;
    const totalMatches = Math.max(1, Math.floor(roundSize / 2));

    const left = pool[index];
    const right = pool[index + 1];

    const roundLabel = useMemo(() => {
        if (roundSize >= 2) return `${roundSize}강`;
        return '결승';
    }, [roundSize]);

    useEffect(() => {
        const run = async () => {
            try {
                const res = await fetch('/stages.json', { cache: 'no-store' });
                const data = (await res.json()) as Stage[];

                const shuffled = [...data].sort(() => Math.random() - 0.5);
                setPool(shuffled);
            } finally {
                setLoading(false);
            }
        };

        run();
    }, []);

    const pick = (winner: Stage) => {
        setWinners((prev) => [...prev, winner]);

        const nextIndex = index + 2;

        if (nextIndex < pool.length) {
            setIndex(nextIndex);
            return;
        }

        const nextPool = [...winners, winner];

        if (nextPool.length === 1) {
            sessionStorage.setItem('worldcup_result', JSON.stringify(nextPool[0]));
            router.push('/worldcup/result');
            return;
        }

        setPool(nextPool);
        setWinners([]);
        setIndex(0);
    };



    return (
        <main className="relative min-h-[100dvh] w-full bg-black">
            {/* 바깥 배경(모바일: 이미지, PC: 단색) */}
            <img
                src={BG}
                alt="background"
                className="absolute inset-0 h-full w-full object-cover lg:hidden"
                style={{ zIndex: 0 }}
            />
            <div
                className="absolute inset-0 hidden lg:block"
                style={{
                    zIndex: 0,
                    background: 'linear-gradient(180deg, #3A0F14 0%, #2A0E10 100%)',
                }}
            />
            <div className="absolute inset-0 bg-black/10" style={{ zIndex: 1 }} />

            {/* 폰 프레임 */}
            <div className="relative z-10 mx-auto min-h-[100dvh] w-full overflow-hidden lg:max-w-[390px] [container-type:inline-size]">
                <img
                    src={BG}
                    alt="frame background"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ zIndex: 0 }}
                />
                <div className="absolute inset-0 bg-black/10" style={{ zIndex: 1 }} />

                {/* Content */}
                <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-6 pt-12 pb-10">
                    {/* Title */}
                    <img
                        src={"/worldcup-logo.png"}
                        alt="Christmas Stage World Cup"
                        className="
                            w-[clamp(200px,83cqw,500px)]
                            select-none
                            pointer-events-none
                            mt-[clamp(10px,5cqw,40px)]
                        "
                    />
                    {/* 현재 단계 정보 */}
                    <div
                        className={`
                            ${Cafe24PROUP.className}
                            mt - 6 
                            text-white/90
                            text-[clamp(14px,5cqw,25px)]
                            tracking-wide 
                        `}
                        style={{ textShadow: '0px 0px 18px rgba(255,255,255,0.25)', }}
                    >
                        {loading ? '불러오는 중…' : `${roundLabel}  ${matchNo}/${totalMatches}`}
                    </div>

                    {/* Videos */}
                    <div className="mt-7 w-[clamp(240px,90cqw,340px)] flex flex-col gap-6">
                        {!loading && left && right ? (
                            <>
                                <VideoCard
                                    videoId={left.youtubeId}
                                    onPick={() => {
                                        pick(left)
                                    }}
                                />
                                <div className={`
                                    ${berlin.className}
                                    text-center
                                    text-white/100
                                    text-[clamp(22px,5.5cqw,30px)]
                                    tracking-[0.2em]
                                    `}>
                                    VS
                                </div>

                                <VideoCard
                                    videoId={right.youtubeId}
                                    onPick={() => {
                                        pick(right)
                                    }}
                                />
                            </>
                        ) : null}
                    </div>

                    <div className="mt-6 text-white/0 select-none">.</div>
                </div>
            </div>
        </main >
    );
}