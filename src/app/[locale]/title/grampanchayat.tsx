'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Grampanchayatitle = () => {
    const t = useTranslations('Grampanchayat');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Grampanchayatitle;