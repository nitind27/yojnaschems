'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Supervisortitle = () => {
    const t = useTranslations('Supervisor');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Supervisortitle;