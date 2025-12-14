import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Particles from "react-tsparticles";
import { loadFireflyPreset } from "tsparticles-preset-firefly";


function App() {

  const particlesInit = async (main) => {
    // Loads the firefly preset
    await loadFireflyPreset(main);
  };
  return (
    <>
     <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          preset: "firefly", // Use the Firefly preset
        }}
        height="100vh"
        width="100vw"
        style={{ position: "absolute", zIndex: -1 }}
      />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
