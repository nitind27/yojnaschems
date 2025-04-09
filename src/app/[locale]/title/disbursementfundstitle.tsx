'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Disbursementfundstitle = () => {
    const t = useTranslations('Disbursementfunds');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Disbursementfundstitle;