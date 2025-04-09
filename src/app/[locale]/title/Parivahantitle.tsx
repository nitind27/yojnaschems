'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Parivahantitle = () => {
    const t = useTranslations('parivahan');

    return (
        <div>
            {t('updatepage')}
        </div>
    );
}

export default Parivahantitle;