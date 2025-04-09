
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db'; // Ensure this path is correct

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const response = await prisma.tbl_slider.findMany(); // Fetch all members
        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching Slider:", error);
        res.status(500).json({ error: 'Failed to fetch Slider' });
    }
};

export default handler;