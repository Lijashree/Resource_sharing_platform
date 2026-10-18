import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { loadSampleData } from "./utils/sampleData";

export default function App() {
  // Load sample data on first run
  useEffect(() => {
    loadSampleData();
  }, []);

  return <RouterProvider router={router} />;
}