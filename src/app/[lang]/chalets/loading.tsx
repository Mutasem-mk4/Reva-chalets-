import { ChaletsGridSkeleton } from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px' }}>
            <ChaletsGridSkeleton count={9} />
        </div>
    );
}
