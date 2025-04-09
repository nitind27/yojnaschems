'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const OpenBalancetitle = () => {
    const t = useTranslations('PraranbhikSillak');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default OpenBalancetitle;