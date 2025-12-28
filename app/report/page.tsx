import { ReportForm } from '@/components/incidents/ReportForm';
import { IncidentFeed } from '@/components/incidents/IncidentFeed';

export default function ReportPage() {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-bg-main p-4 md:p-8">
            <div className="max-w-7xl mx-auto h-full">
                <div className="grid lg:grid-cols-12 gap-6 h-full">

                    <div className="hidden lg:block lg:col-span-4 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                        <div className="sticky top-0 bg-bg-main z-10 pb-4 mb-2">
                            <h1 className="text-2xl font-bold text-white">Before you report...</h1>
                            <p className="text-text-secondary text-sm">
                                Check if your incident has already been reported to help us respond faster.
                            </p>
                        </div>
                        <IncidentFeed />
                    </div>

                    <div className="lg:col-span-8">
                        <ReportForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
