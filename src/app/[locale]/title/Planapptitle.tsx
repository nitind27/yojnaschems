'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Planapptitle = () => {
    const t = useTranslations('Plans');

    return (
        <div>
            {t('titleapp')}
        </div>
    );
}

export default Planapptitle; 