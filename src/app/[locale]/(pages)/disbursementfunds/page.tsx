import Disbursementfunds from '@/components/Disbursementfunds/Disbursementfunds'
import { grampanchayat, NidhiVitaran, Representative, talukasdata, WorkMaster, WorkMasterDemo } from '@/components/type';
import prisma from '@/lib/db';
import React from 'react'
import TitleCard from '../../title/breadcums/Titilecard';
import Disbursementfundstitle from '../../title/disbursementfundstitle';
import { Villages } from '@prisma/client';

const page = async () => {

  let disbursementfunds: NidhiVitaran[] = [];
  let workmaster: WorkMaster[] = [];
  let workmasterdemo: WorkMasterDemo[] = [];
  let reprenstive: Representative[] = [];
  let Workmasters: WorkMasterDemo[] = [];
  let talukas: talukasdata[] = [];
  let grampanchayat: grampanchayat[] = [];
  let Villages: Villages[] = [];

  try {
    disbursementfunds = await prisma.nidhiVitaran.findMany(); // Fetch all clusters
    workmaster = await prisma.workMaster.findMany(); // Fetch all clusters
    workmasterdemo = await prisma.workMasterDemo.findMany(); // Fetch all clusters
    reprenstive = await prisma.representative.findMany();
    Workmasters = await prisma.workMasterDemo.findMany();
    talukas = await prisma.talukasData.findMany();

    Villages = await prisma.villages.findMany(); // Fetch all QR codes
    grampanchayat = await prisma.grampanchayat.findMany();
  } catch (error) {
    console.error("Error fetching disbursementfunds data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }
  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'disbursementfunds', href: '/disbursementfunds' },
  ];
  const workgen = Workmasters.filter((gen) => gen.type !== "workgen")
  return (
    <div>
 
      <h1 className="card card-body mt-5">
      <TitleCard breadcrumbs={breadcrumbs} />
      </h1>
      <div><Disbursementfunds initialdisbursementfunds={disbursementfunds} workmaster={workmaster} reprenstive={reprenstive} Workmasters={workgen} talukas={talukas} grampanchayat={grampanchayat} Villages={Villages} workmasterdemo={workmasterdemo}/></div>
    </div>
  )
}

export default page