'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Representativetitle = () => {
    const t = useTranslations('Representative');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Representativetitle; 