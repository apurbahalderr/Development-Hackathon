import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Activity, AlertTriangle } from 'lucide-react';

export function Hero() {
    return (
        <div className="relative overflow-hidden bg-bg-main pt-16 pb-32">
            <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[30rem] bg-gradient-to-tr from-primary/20 to-transparent opacity-30 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        The Pulse of <br />
                        <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">Prevention</span>
                    </h1>

                    <p className="text-xl text-text-secondary mb-10 leading-relaxed">
                        Pulstrix connects citizens, responders, and authorities in real-time.
                        Report critical issues, track emergency responses, and save lives with speed and accuracy.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/report">
                            <Button size="lg" variant="primary" className="w-full sm:w-auto text-lg h-14 px-8 shadow-lg shadow-primary/25" rightIcon={<AlertTriangle size={20} />}>
                                Report Issue Now
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8">
                                How It Works
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
