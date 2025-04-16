import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Ova } from "@/inteface/ova";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import ovaService from "@/services/ova-service";
import { Toaster } from "../ui/sonner";

interface Props {
  ova?: Ova;
}

const useFetch = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (id: string) => {
    setError(null); // Reset error state before fetching
    try {
      setLoading(true);
      const zip = await ovaService.fetchOvaZip(id);
      if (!zip.success) {
        throw new Error(zip.message);
      }
      return {
        success: true,
        data: zip.data,
      };
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, fetchData };
};

export const OvaCard: React.FC<Props> = ({ ova }) => {
  const { loading, error, fetchData } = useFetch();

  // Function to navigate to the OVA's URL in a new tab
  const handleNavigateToTheOva = () => {
    if (!ova) return;
    window.open(ova.ovaPath, "_blank");
  };

  // Function to trigger the download of a file from a given URL
  const handleDownload = (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ova?.title}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Function to handle the creation and download of the OVA zip file
  const handleZip = async () => {
    if (!ova) return;
    const zip = await fetchData(ova.id);

    if (!zip) return;

    if (zip.success) {
      toast.success("OVA zip created successfully 📁", {
        duration: 5000,
        description: "Your zip file is ready for download.",
      });
      handleDownload(zip.data);
    }
  };

  useEffect(() => {
    if (loading) {
      toast.info("Started OVA zip creation 📁", {
        duration: 5000,
        description: "Please wait while we create the zip file.",
      });
      return;
    }

    if (error) {
      toast.error("Failed to create OVA zip 📁", {
        duration: 5000,
        description: "Please try again later.",
      });
      return;
    }
  }, [loading, error]);

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold capitalize">
            {ova?.title || "Ova"}
          </h2>
          <Badge variant="neutral" className="text-sm font-light capitalize">
            {ova?.group || "Group-2"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <img
          src={ova?.imagePath}
          alt={ova?.title}
          className="w-full h-48 border-border border-2 object-cover"
        />
      </CardContent>
      <CardFooter className="flex flex-between items-center gap-2.5">
        <Button variant="neutral" onClick={handleNavigateToTheOva}>
          Go to the OVA
        </Button>
        <Button onClick={handleZip}>Download</Button>
      </CardFooter>
      <Toaster />
    </Card>
  );
};
