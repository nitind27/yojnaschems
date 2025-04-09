'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Plantitle = () => {
    const t = useTranslations('Plans');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Plantitle; 