'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

const
    Beneficiarytitile = () => {
        const t = useTranslations('beneficiary');

        return (
            <div>
                {t('title')}
            </div>
        );
    }

export default Beneficiarytitile;