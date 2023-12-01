import BubbleContent from "./bubbleContent";
import BubbleTools from "./bubbleTools";
import { useOutletContext } from "react-router-dom";

const Bubble = () => {
  const [tools] = useOutletContext() as any[];
  return <>{!tools ? <BubbleContent /> : <BubbleTools />}</>;
};
export default Bubble;
