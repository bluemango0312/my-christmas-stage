import type { Stage } from '../../lib/worldcup/types';

export async function loadStages(): Promise<Stage[]> {
    {/* cache: 'no-store' => 개발 중에 json 수정했을 때 바로 반영되게 하는 용도 */ }
    const res = await fetch('/stages.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load stages.json');
    return res.json();
}
