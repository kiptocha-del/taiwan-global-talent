import { BookOpen, CheckCircle2, Languages, Video } from 'lucide-react';
import type { TeacherStats } from '@/types/teacher/type';

export default function TeacherMetrics({ stats }: { stats: TeacherStats }) {
    const cards = [
        { title: 'Total Courses', value: stats.total_courses, icon: BookOpen, color: 'text-accent bg-accent-soft border-accent/30' },
        { title: 'Published Courses', value: stats.published_courses, icon: CheckCircle2, color: 'text-status-positive bg-status-positive-soft border-status-positive/30' },
        { title: 'Mandarin Tracks', value: stats.mandarin_courses, icon: Languages, color: 'text-status-warning bg-status-warning-soft border-status-warning/30' },
        { title: 'Total Lessons', value: stats.total_lessons, icon: Video, color: 'text-accent bg-accent-soft border-accent/30' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                
                return (
                    <div key={idx} className="bg-surface p-5 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-muted uppercase tracking-wider">{card.title}</p>
                            <h3 className="text-2xl font-black text-ink mt-1">{card.value}</h3>
                        </div>
                        <div className={`p-3.5 rounded-2xl border ${card.color}`}>
                            <Icon className="w-6 h-6"/>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}