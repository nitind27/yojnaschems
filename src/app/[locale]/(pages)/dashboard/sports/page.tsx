import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import SchoolDashboard from "@/components/Dashboard/SchoolManage/SchoolDashboard";
import SportDashboard from "@/components/Dashboard/Sports/SportDashboard";
import Sportsexcle from "@/components/Dashboard/Sports/Sportsexcle";
import { Schooldata, Standarddata, StudentData, TblAchivments, TblSports, TblSportsInfoNew } from "@/components/type";
import prisma from "@/lib/db";

const page = async () => {
    let sportsdata: TblSports[] = [];
    let studentdata: StudentData[] = [];
    let sportsinfo: TblSportsInfoNew[] = [];
    let schooldata: Schooldata[] = [];
    let standarddata: Standarddata[] = [];
    let TblAchivments: TblAchivments[] = [];

    try {
        sportsdata = await prisma.tblSports.findMany();
        standarddata = await prisma.standard.findMany();
        schooldata = await prisma.school.findMany();
        TblAchivments = await prisma.tbl_achivments.findMany();
        studentdata = await prisma.student.findMany(); // Fetch all students
        sportsinfo = await prisma.sportsInfo.findMany(); // Fetch all students
    } catch (error) {
        console.error("Error fetching cluster data:", error);
        return (
            <div>
                <h1>Error fetching Data</h1>
            </div>
        );
    }
    const breadcrumbs = [

        { label: 'dashboard', href: '/dashboard' },
        { label: 'sports', href: '/dashboard/sports' },

    ];
    console.log("studentdata", studentdata.map((data) => data.admited_in_std))

    // const studentdatas = studentdata.filter((data)=>data.student_id == sportsinfo.map((sports)=>sports.sports_record.split["|"][1]))
    return (
        <div>
            <div className="container mt-5 card card-body col-lg-12 mb-5">
                <div className="d-flex justify-content-between ">

                    <div>

                        <TitleCard breadcrumbs={breadcrumbs} />
                    </div>
                    <div>

                        <Sportsexcle
                            members={[]} // Assuming you will populate this later
                            sportsdata={sportsdata} // Use the school_name property
                            totalstudent={[]} // You might want to fetch this data as well
                            curruntstudent={[]} // Count of current students for this school
                            stddata={[]}
                            sportsinfo={sportsinfo}
                            index={[]}
                            studentdata={studentdata} schooldata={schooldata}
                            standarddata={standarddata}
                            TblAchivments={TblAchivments} />
                    </div>
                </div>
            </div>
            <div className="container mt-5">
                <div className="row col-lg-12">
                    {sportsdata.map((school, index) => {

                        // // Filter students for the current school
                        const filteredStudents = sportsinfo.filter((student) => {
                            const sportsRecord = student.sports_record.replace(/,/g, "|"); // Normalize the record
                            const splitRecord = sportsRecord.split("|"); // Split by pipes

                            // Check if the first element matches school.sports_id
                            // and if the second element matches any active student's ID
                            // console.log('fdsafsad',studentdata.map((data) => data.admitted_in_std ))
                            return (
                                splitRecord[0] == school.sports_id as any &&
                                studentdata.some((data) => data.student_id == splitRecord[1] as any && data.status == "Active" && data.admited_in_std != null && data.admited_in_std != 0 && data.school_id != null && data.school_id != 0 && data.current_std != null && data.current_std != 0 && data.type_of_students != null && data.type_of_students != "0" && data.dropout == "Not" || data.dropout == "Transfer")

                            );
                        });


                        // const datass = filteredStudents.filter((stu) => stu.sports_record.split("|")[1] == studentdata.map((data) => data.student_id) as any && studentdata.map((data) => data.admitted_in_std) as any !== 0 && studentdata.map((data) => data.current_std) as any !== 0 && studentdata.map((data) => data.status) as any == "Active" && studentdata.map((data) => data.school_id) as any !== 0 && studentdata.map((data) => data.type_of_students) as any !== null && studentdata.map((data) => data.dropout) as any == 'Not' || 'Transfer')

                        // const studentsdatas = studentdata.filter((datas) => datas.student_id == filteredStudents.map((data) => data.sports_record.split("|")[1]) as any && datas.admitted_in_std !== 0 && datas.current_std !== 0 && datas.status == "Active" && datas.school_id !== 0 && datas.type_of_students !== null && datas.dropout == 'Not' || 'Transfer')
                        return (
                            <div className="col-md-3 mb-2" key={index}>
                                <SportDashboard
                                    members={school.sports_id} // Assuming you will populate this later
                                    schoolname={school.sports_name} // Use the school_name property
                                    totalstudent={school.icon} // You might want to fetch this data as well
                                    curruntstudent={filteredStudents.length} // Count of current students for this school
                                    stddata={filteredStudents}
                                    sportsinfo={sportsinfo}
                                    index={index + 1}
                                    studentdata={studentdata} schooldata={schooldata}
                                    standarddata={standarddata}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default page;
