'use client';

import Image from 'next/image';
import {cn} from '@/lib/classname';

const dashboardContents = [
  {
    id: 1,
    title: 'Website Internal Report Preventive Maintenance Data center',
    description:
      'Website ini dirancang untuk mempermudah Engineer ketika sudah melaksanakan preventive maintenance data center dalam pembuatan report lampiran foto foto',
    image: '/sample-dashboard-image.svg',
  },
  {
    id: 2,
    title: 'Sistem Laporan Preventive Maintenance Data Center',
    description:
      'Website ini memudahkan engineer dalam proses pencatatan, pengunggahan dokumentasi foto, serta pembuatan laporan preventive maintenance secara otomatis sehingga meningkatkan efisiensi pekerjaan dan akurasi data.',
    image: '/sample-dashboard-image2.svg',
  },
];

export default function UserDashboardPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <div className="relative w-full h-87.5 md:h-112.5">
        <Image
          src="/dashboard-illustration.svg"
          alt="Dashboard Summary"
          fill
          sizes="30vw"
          className="object-contain"
          priority
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="px-8 md:px-16 py-12 space-y-16">
        {dashboardContents.map((item, index) => {
          const isEven = index % 2 !== 0;

          return (
            <div
              key={item.id}
              className={cn(
                'flex flex-col gap-6 transition-all duration-500',
                isEven ? 'md:pl-48' : 'md:pr-48',
              )}
            >
              <div className="flex gap-4 items-start">
                <div className="w-3 h-20 md:h-25 bg-[#293038] rounded-full shrink-0 mt-1"></div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-white text-xl md:text-2xl font-bold leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="relative w-full h-62.5 md:h-100 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer">
                <Image
                  src="/history-illustration.svg"
                  alt="Monitoring"
                  fill
                  sizes="30vw"
                  className="object-contain group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
