import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
   <div className="flex">
      <Image src="/logo.jpg" width={50} height={50} alt=""></Image>
      <p className="text-xl font-semibold tracking-tight items-center mt-2"><span className="text-red-500">Flex</span>Tube</p>
   </div>
  );
}
