'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Notoficationtitle = () => {
    const t = useTranslations('Notification');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Notoficationtitle;