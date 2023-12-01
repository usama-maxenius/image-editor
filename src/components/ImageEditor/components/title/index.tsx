import TitleContent from "./titleContent";
import TitleTools from "./titleTool";
import { useOutletContext } from "react-router-dom";

const Title = () => {
  const [tools] = useOutletContext() as any[];
  return <>{!tools ? <TitleContent /> : <TitleTools />}</>;
};
export default Title;
