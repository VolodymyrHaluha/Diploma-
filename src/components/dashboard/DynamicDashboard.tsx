'use client';

import dynamic from 'next/dynamic';

function DashboardSkeleton() {
  return (
    <section className="py-10">
      <div className="container mx-auto grid gap-4 px-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="glass-card h-72 animate-pulse rounded-xl border-white/10 bg-white/5" />
        ))}
      </div>
    </section>
  );
}

export const DynamicDashboard = dynamic(
  () => import('@/components/dashboard/ThreeColumnDashboard').then((module) => module.ThreeColumnDashboard),
  {
    ssr: false,
    loading: DashboardSkeleton,
  }
);
