import WritePostContent from "./writePostContent";
import WritePostTools from "./writePostTools";
import { useOutletContext } from "react-router-dom";

const WritePost = () => {
  const [tools] = useOutletContext() as any[];
  return <>{!tools ? <WritePostContent /> : <WritePostTools />}</>;
};
export default WritePost;
