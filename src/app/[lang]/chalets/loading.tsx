import { ChaletsGridSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 className="text-2xl font-bold mb-6 text-emerald-900">Loading Chalets...</h1>
            <ChaletsGridSkeleton count={9} />
        </div>
    );
}
