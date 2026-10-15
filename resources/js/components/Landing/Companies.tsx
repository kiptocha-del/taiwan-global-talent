const organizations = [
    'Universities',
    'Mandarin centers',
    'Taiwan employers',
    'Scholarship programs',
    'Community mentors',
];

export default function Companies() {
    return (
        <section id="companies" className="bg-[#FFF8ED] px-5 py-24">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 border-t border-[#24458F]/12 pt-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
                    <div>
                        <p className="text-sm font-extrabold text-[#C4573C]">
                            Built through local connection
                        </p>
                        <h2 className="mt-3 font-display text-3xl leading-tight font-black text-[#24458F] md:text-4xl">
                            Connecting international talent with Taiwan’s
                            learning and work ecosystem.
                        </h2>
                    </div>
                    <div className="flex flex-wrap gap-x-8 gap-y-5 lg:justify-end">
                        {organizations.map((organization) => (
                            <span
                                key={organization}
                                className="border-b-2 border-[#24458F]/15 pb-1 text-sm font-extrabold text-[#24458F]/65"
                            >
                                {organization}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="mt-10 max-w-3xl text-xs leading-6 font-semibold text-[#24458F]/45">
                    Partner names and logos will appear here once participation
                    and brand-use approval are confirmed. We do not imply
                    partnerships before they are official.
                </p>
            </div>
        </section>
    );
}
