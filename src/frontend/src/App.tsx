import {MainPage} from "./MainPage.tsx";
import {FileUpload} from "./FileUpload.tsx";
import {Done} from "./Done.tsx";

function App() {

  return (
      <>
          <MainPage />
          {(page === "upload" ? <FileUpload/> : null)}
          {(page === "done" ? <Done filename={filename}/> : null)}
      </>
  );
}

export default App
