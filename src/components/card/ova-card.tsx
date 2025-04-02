import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export const OvaCard = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">OVA</h2>
          <span className="text-sm text-gray-500">OVAs</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* <img src="/images/ova.png" alt="OVA" className="w-full h-auto" /> */}
      </CardContent>
      <CardFooter className="flex flex-between items-center gap-2.5">
        <Button>Cancel</Button>
        <Button variant="neutral">Deploy</Button>
      </CardFooter>
    </Card>
  );
};
