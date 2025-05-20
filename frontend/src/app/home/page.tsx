"use client";

import { Button, Card, CardBody, CardHeader, Image } from "@heroui/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function Home() {
  const docs = useQuery(api.documents.getAll);
  return (
    <div className="flex justify-center items-center">
      <div className="w-full mx-96 my-48">
        {docs?.map((d) => (
          <Link href={`/home/${d._id}`} key={d._id}>
            <Card className="py-4 w-max">
              <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <p className="text-tiny uppercase font-bold">Document</p>
                <small className="text-default-500">{d._creationTime}</small>
                <h4 className="font-bold text-large">{d.title}</h4>
              </CardHeader>
              <CardBody className="overflow-visible py-2">
                <Image
                  alt="Card background"
                  className="object-cover rounded-xl"
                  src="https://heroui.com/images/hero-card-complete.jpeg"
                  width={270}
                />
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
