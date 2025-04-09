'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Nidhiaada = () => {
    const t = useTranslations('Sidebar');

    return (
        <div>
            {t('Nidhi_Ada_Transport')}
        </div>
    );
}

export default Nidhiaada;