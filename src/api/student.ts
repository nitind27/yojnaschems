import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db'; // Ensure this path is correct

// Utility function to validate date
const isValidDate = (dateString: string): boolean => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Fetch all students
        const students = await prisma.student.findMany();

        // Filter out students with invalid date_of_birth
        const validStudents = students.filter(student => isValidDate(student.date_of_birth as any));

        // Log invalid dates if any
        students.forEach(student => {
            if (!isValidDate(student.date_of_birth as any)) {
                console.warn(`Invalid date detected for student ID ${student.student_id  as any}: ${student.date_of_birth as any}`);
            }
        });

        // Return the valid students
        res.status(200).json(validStudents);
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};

export default handler;
