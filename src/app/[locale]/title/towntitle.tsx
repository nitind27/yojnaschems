'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Towntitle = () => {
    const t = useTranslations('Townpage');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Towntitle;