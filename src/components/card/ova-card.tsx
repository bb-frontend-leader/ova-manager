import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Image } from "astro:assets";
import ImageCard from "./ImageCard.astro";
import type { Ova } from "@/inteface/ova";

interface Props {
  ova?: Ova;
  children?: React.ReactNode;
}

export const OvaCard: React.FC<Props> = ({ ova, children }) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold capitalize">{ova?.title || "Ova"}</h2>
          <Badge variant="neutral" className="text-sm font-light capitalize">
            {ova?.group || "Group-2"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-between items-center gap-2.5">
        <Button variant="neutral">Go to the OVA</Button>
        <Button>Download</Button>
      </CardFooter>
    </Card>
  );
};
