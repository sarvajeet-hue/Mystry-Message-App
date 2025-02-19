import dbConnect from "@/lib/dbConnect";
import type { NextApiRequest , NextApiResponse } from "next";

const handler = (req : NextApiRequest , res : NextApiResponse) => {
    dbConnect()
    res.send("hello world")
}

export default handler