import { useLocale } from 'next-intl';
import Link from 'next/link'
import React from 'react'
import './Baneficiaryidwise.css'
const Baneficiaryidwise = ({ idx, yojnaname, yojnaid, filteryojnayear, categoriesnamelength, categoriesname,subcategoryid ,yojnaids}: any) => {
  const localActive = useLocale();
  return (
    <div>
      <Link href={`/${localActive}/yojna/schemes/beneficiary/beneficiryidwise/${yojnaid}/${filteryojnayear}/${categoriesnamelength}/${categoriesnamelength}/${subcategoryid}/${yojnaids}`} className="linkcolor">
        {idx}. {yojnaname}{" "}
      </Link>
    </div>
  )
}

export default Baneficiaryidwise
