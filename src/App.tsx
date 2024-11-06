import React from "react";
import Header from "./components/HeaderCadastra";
import Footer from "./components/FooterCadastra";
import { MinicartProvider } from "./context"
import ProductCatalog from "./components/ProductCatalog";

const App = () => {
  return (
    <MinicartProvider>
      <Header />
      <section className="category">
          <ProductCatalog />
      </section>
      <Footer/>
    </MinicartProvider> 
  )
};

export default App;
