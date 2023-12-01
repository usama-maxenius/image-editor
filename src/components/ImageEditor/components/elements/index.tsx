import ElementContent from "./elementContent";
import ElementTools from "./elementTools";
import { useOutletContext } from "react-router-dom";

const Element = () => {
  const [tools] = useOutletContext() as any[];
  return <>{!tools ? <ElementContent /> : <ElementTools />}</>;
};
export default Element;
