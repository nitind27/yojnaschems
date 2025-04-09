'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const Yojnatypetitle = () => {
    const t = useTranslations('Yojnatype');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default Yojnatypetitle;