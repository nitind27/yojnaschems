'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Banktitle = () => {
    const t = useTranslations('Bank');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Banktitle;