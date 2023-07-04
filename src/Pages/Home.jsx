import Authorized from "../components/Authorised";
import DefaultFeature from "../components/DefaultFeature";
function Home() {
  return (
    <Authorized>
      <DefaultFeature />
    </Authorized>
  );
}

export default Home;
