import Authorized from "../components/Authorised";
import SearchPapersComponents from "../components/SearchPapersComponent";
function SearchPapers() {
  return (
    <Authorized>
      <SearchPapersComponents />
    </Authorized>
  );
}

export default SearchPapers;
