/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getPublicScholarships } from "@/app/(commonLayout)/scholarships/_actions";
import { useQuery } from "@tanstack/react-query";

const PublicScholarshipsList = () => {

    const {data}=useQuery<any>({
        queryKey:["publicScholarships"],
        queryFn:getPublicScholarships
    })

    console.log(data);
  return (
    <div>
      {data.data.map((scholarship: any) => (
        <div key={scholarship.id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-bold">{scholarship.title}</h2>
          <p>{scholarship.description}</p>
        </div>        
      ))}
    </div>
  );
};

export default PublicScholarshipsList; 