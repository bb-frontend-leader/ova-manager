import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Image } from "astro:assets";
import ImageCard from "./ImageCard.astro";

interface Props {
  ova?: {
    title?: string;
    group?: string;
    imagePath?: string;
  };
  children?: React.ReactNode;
}

export const OvaCard: React.FC<Props> = ({ ova, children }) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{ova?.title || "Ova"}</h2>
          {/* <span className="text-sm text-gray-500">{ova?.group || "Group-2"}</span> */}
          <Badge variant="neutral" className="text-sm font-light">
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
