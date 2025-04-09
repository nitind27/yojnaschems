'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Suvidhatitle = () => {
    const t = useTranslations('Suvidha');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Suvidhatitle;