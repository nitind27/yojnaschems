'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Categorytitle = () => {
    const t = useTranslations('Category');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Categorytitle;