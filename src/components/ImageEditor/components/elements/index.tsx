import ElementContent from "./elementContent";
import { useOutletContext } from "react-router-dom";

const Element = () => {
  const [tools] = useOutletContext() as any[];
  return <>{!tools && <ElementContent /> }</>;
};
export default Element;
