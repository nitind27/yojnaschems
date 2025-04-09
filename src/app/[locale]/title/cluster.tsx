'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Cluster = () => {
    const t = useTranslations('IndexPage');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Cluster;