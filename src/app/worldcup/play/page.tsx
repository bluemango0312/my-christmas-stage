'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Stage } from '../../../lib/worldcup/types';
import { inter } from '@/lib/fonts';
import { berlin, Cafe24PROUP } from '@/lib/fonts';
import { useRouter } from 'next/navigation';

const BG = '/worldcup-bg.png';

function VideoCard({
    videoId,
    artist,
    title,
    onPick,
}: {
    videoId: string;
    artist: string;
    title: string;
    onPick: () => void;
}) {
    return (
        <div
            className="
        rounded-2xl
        overflow-hidden
        border
        border-[#C13939]/25
        bg-white/5
        shadow-[0_10px_30px_rgba(0,0,0,0.35),0_0_18px_rgba(193,57,57,0.16)]
      "
        >
            <div className="relative w-full aspect-video bg-black">
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`${artist} - ${title}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-black/5" />
            </div>

            <div className="px-4 pt-3 pb-2 bg-white/5">
                <div className="text-white/60 text-[12px] leading-tight truncate">
                    {artist}
                </div>

                <div className="mt-[-3px] flex items-center gap-3">
                    <div className="flex-1 text-white/90 text-[13px] font-semibold leading-tight truncate">
                        {title}
                    </div>

                    <button
                        type="button"
                        onClick={onPick}
                        className={`
              ${inter.className}
              shrink-0
              relative -top-[2px]
              rounded-lg
              border
              border-[#C13939]/40
              bg-[#2A0E10]/30
              px-3
              py-1.5
              text-[11px]
              text-white/85
              shadow-[inset_0_0_10px_rgba(193,57,57,0.15)]
              hover:bg-[#2A0E10]/40
              active:scale-[0.98]
              transition
            `}
                    >
                        선택하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function WorldcupPlayPage() {
    const router = useRouter();

    const INITIAL_SIZE = 32;

    const [loading, setLoading] = useState(true);
    const [pool, setPool] = useState<Stage[]>([]);
    const [index, setIndex] = useState(0);
    const [winners, setWinners] = useState<Stage[]>([]);

    const [semiLosers, setSemiLosers] = useState<Stage[]>([]);
    const [runnerUp, setRunnerUp] = useState<Stage | null>(null);
    const [isThirdPlaceMatch, setIsThirdPlaceMatch] = useState(false);

    const [finalists, setFinalists] = useState<Stage[]>([]);
    const [thirdPlace, setThirdPlace] = useState<Stage | null>(null);
    const [isFinalMatch, setIsFinalMatch] = useState(false);

    const roundSize = pool.length;
    const left = pool[index];
    const right = pool[index + 1];

    const matchNo = useMemo(() => Math.floor(index / 2) + 1, [index]);
    const totalMatches = useMemo(() => Math.max(1, Math.floor(roundSize / 2)), [roundSize]);

    const [showGuide, setShowGuide] = useState(false);

    const roundLabel = useMemo(() => {
        if (isThirdPlaceMatch) return '3·4위전';
        if (isFinalMatch || roundSize === 2) return '결승';
        if (roundSize > 2) return `${roundSize}강`;
        return '결과';
    }, [roundSize, isThirdPlaceMatch, isFinalMatch]);


    useEffect(() => {
        const run = async () => {
            try {
                sessionStorage.removeItem('worldcup_result');
                sessionStorage.removeItem('worldcup_top3');

                const res = await fetch('/stages.json', { cache: 'no-store' });
                const data = (await res.json()) as Stage[];

                const shuffled = [...data].sort(() => Math.random() - 0.5);
                const initialPool = shuffled.length >= INITIAL_SIZE ? shuffled.slice(0, INITIAL_SIZE) : shuffled;

                setPool(initialPool);
                setIndex(0);
                setWinners([]);
                setSemiLosers([]);
                setRunnerUp(null);
                setIsThirdPlaceMatch(false);
                setFinalists([]);
                setThirdPlace(null);
                setIsFinalMatch(false);

            } finally {
                setLoading(false);
            }
        };

        run();
    }, []);

    const pick = (winner: Stage) => {
        const currentLeft = pool[index];
        const currentRight = pool[index + 1];
        if (!currentLeft || !currentRight) return;

        const loser = currentLeft.id === winner.id ? currentRight : currentLeft;

        // 3·4위전 처리: 승자 = 3등 확정, 그 다음 결승으로 넘어감
        if (isThirdPlaceMatch) {
            setThirdPlace(winner);

            setPool(finalists);
            setIndex(0);
            setWinners([]);
            setIsThirdPlaceMatch(false);
            setIsFinalMatch(true);
            return;
        }

        // 결승 처리: top3 저장 후 결과로
        if (isFinalMatch && roundSize === 2) {
            const champion = winner;
            const runnerUpLocal = loser;

            sessionStorage.setItem('worldcup_result', JSON.stringify(champion));

            const t3 = thirdPlace ? [champion, runnerUpLocal, thirdPlace] : [champion, runnerUpLocal];
            sessionStorage.setItem('worldcup_top3', JSON.stringify(t3.slice(0, 3)));

            router.push('/worldcup/result');
            return;
        }

        // 일반 라운드 진행
        const nextWinners = [...winners, winner];
        setWinners(nextWinners);

        const nextSemiLosers = pool.length === 4 ? [...semiLosers, loser] : semiLosers;
        if (pool.length === 4) setSemiLosers(nextSemiLosers);

        const nextIndex = index + 2;

        if (nextIndex < pool.length) {
            setIndex(nextIndex);
            return;
        }

        // 라운드 종료
        // 4강 종료 시: 결승 진출자 저장 → 3·4위전 먼저 진행
        if (pool.length === 4) {
            setFinalists(nextWinners);
            setPool(nextSemiLosers);
            setIndex(0);
            setWinners([]);
            setIsThirdPlaceMatch(true);
            setIsFinalMatch(false);
            return;
        }

        // 나머지 라운드: 승자들로 다음 라운드
        setPool(nextWinners);
        setIndex(0);
        setWinners([]);
    };


    return (
        <main className="relative min-h-[100dvh] w-full bg-black">
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

            <div className="relative z-10 mx-auto min-h-[100dvh] w-full overflow-hidden lg:max-w-[390px] [container-type:inline-size]">
                <img
                    src={BG}
                    alt="frame background"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ zIndex: 0 }}
                />
                <div className="absolute inset-0 bg-black/10" style={{ zIndex: 1 }} />

                <div className="relative z-10 flex min-h-[100dvh] flex-col items-center px-6 pt-12 pb-10">
                    <img
                        src="/worldcup-logo.png"
                        alt="Christmas Stage World Cup"
                        className="
                        w-[clamp(200px,83cqw,500px)]
                        select-none
                        pointer-events-none
                        mt-[clamp(10px,5cqw,40px)]
                        "
                    />

                    <div
                        className={`
                        ${Cafe24PROUP.className}
                        mt-2
                        text-white/90
                        text-[clamp(14px,5cqw,25px)]
                        tracking-wide
                        `}
                        style={{ textShadow: '0px 0px 18px rgba(255,255,255,0.25)' }}
                    >
                        {loading ? '불러오는 중…' : `${roundLabel}  ${matchNo}/${totalMatches}`}
                    </div>

                    <div className="mt-10 w-[clamp(240px,90cqw,340px)] flex flex-col gap-5">
                        {!loading && left && right ? (
                            <>
                                <VideoCard
                                    videoId={left.youtubeId}
                                    artist={left.artist}
                                    title={left.title}
                                    onPick={() => pick(left)}
                                />

                                <div
                                    className={`
                    ${berlin.className}
                    text-center
                    text-white/100
                    text-[clamp(22px,5.5cqw,30px)]
                    tracking-[0.2em]
                  `}
                                >
                                    VS
                                </div>

                                <VideoCard
                                    videoId={right.youtubeId}
                                    artist={right.artist}
                                    title={right.title}
                                    onPick={() => pick(right)}
                                />
                            </>
                        ) : null}
                    </div>

                    <div className="mt-6 text-white/0 select-none">.</div>
                </div>
            </div>
        </main>
    );
}
