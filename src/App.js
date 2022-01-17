import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import TranscriptionTool from "./pages/TranscriptionTool";
import Guidelines from "./pages/Guidelines";



function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TranscriptionTool />}></Route>
        <Route path="/guidelines" element={<Guidelines />}></Route>
      </Routes>
    </Layout>
  );
}

export default App;
