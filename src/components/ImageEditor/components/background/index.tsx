import BackgroundContent from "./backgroundContent";
import BackgroundTools from "./backgroundTools";
import { useOutletContext } from "react-router-dom";

const Background = () => {
  const [tools] = useOutletContext() as any[];
  return <>{!tools ? <BackgroundContent /> : <BackgroundTools />}</>;
};
export default Background;
