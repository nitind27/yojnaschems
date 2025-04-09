import React from 'react'
import Table from '../table/Table'
import { Button } from 'react-bootstrap'
import { KTIcon } from '@/_metronic/helpers'
import { useTranslations } from 'next-intl'

const Tabledata = ({data,columns}:any) => {
    const t = useTranslations("Disbursementfunds");
  return (
    <div>
      <Table
        data={data}
        columns={columns}
        Button={
          <Button
            variant="primary"
            // onClick={handleShowPrint}
            className="btn btn-sm"
          >
            <KTIcon
              iconName={"plus-circle"}
              className="fs-3"
              iconType="solid"
            />
            {t("addDisbursement")}
          </Button>
        }
      />
    </div>
  )
}

export default Tabledata
