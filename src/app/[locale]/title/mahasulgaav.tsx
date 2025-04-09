'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Mahasulgaavtitle = () => {
    const t = useTranslations('MahasulGaav');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Mahasulgaavtitle;