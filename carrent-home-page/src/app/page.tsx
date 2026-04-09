import CallAction from "@/pages/CallAction";
import Feature from "@/pages/Feature";
import HowitWorks from "@/pages/HowitWorks";
import Starter1 from "@/pages/Starter1";
import Whyus from "@/pages/Whyus";
import { getCars } from "@/server/car";

export default async function Home() {
  const cars = await getCars(6,0)
  return (
    <>
    <Starter1/>
    <Feature cars={cars}/>
    <Whyus/>
    <HowitWorks/>
    <CallAction/>
    </>
  );
}
