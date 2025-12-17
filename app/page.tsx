import Image from "next/image";
import HomePage from "../components/ui/HomePage"
import SubHomePage from "../components/ui/SubHomePage";
import Footer from "../components/ui/Footer";
import WhyToBookWithRailYatri from "@/components/ui/whyPage";
export default function Home() {
  return (
   <div>
    <HomePage/>
    <SubHomePage/>
    <WhyToBookWithRailYatri/>
    <Footer/>
   </div>
  );
}
