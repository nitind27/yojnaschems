'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const SubCategorytitle = () => {
    const t = useTranslations('Subcategory');

    return (
        <div>
            {t('title')}
        </div>
    );
}

export default SubCategorytitle;