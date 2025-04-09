"use client"
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

import { usePathname } from 'next/navigation';

// Define the type for breadcrumb items
interface BreadcrumbItem {
    label: string;
    title?: string;
    href: string;
    linkurl?: string;
}

// Breadcrumbs component
const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
    const localActive = useLocale();
    const router = usePathname();
    const t = useTranslations('Sidebar');

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {items.map((item, index) => {
                    // Determine if this is the last item and matches the current path
                    const isActive = `/${localActive}${item.href == "" ? item.linkurl : item.href}` == router;

                    return (
                        <li key={index} className={`breadcrumb-item ${isActive ? 'active' : ''}`}>
                            <Link href={`/${localActive}${item.href == "" ? item.linkurl : item.href}`} className={isActive ? 'text-dark' : ''} style={{ fontSize: isActive ? "18px" : "16px" }}>
                                {item.label == "" ? item.title : t(`${item.label}`)}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav >
    );
};

// TitleCard component with breadcrumbs
interface TitleCardProps {
    breadcrumbs: BreadcrumbItem[];
}

const TitleCard: React.FC<TitleCardProps> = ({ breadcrumbs }) => {
    return (
        <div className="container">

            <Breadcrumbs items={breadcrumbs} />
        </div>
    );
};

export default TitleCard;