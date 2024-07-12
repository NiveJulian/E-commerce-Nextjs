import { createGlobalStyle } from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import CartContextProvider from "../components/CartContext";

const GlobalStyles = createGlobalStyle`
  body{
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: "Poppins", sans-serif;
  }
`;

const App = ({ Component, pageProps }) => (
  <>
    <HelmetProvider>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </HelmetProvider>
    <GlobalStyles />
    <CartContextProvider>
      <Component {...pageProps} />
    </CartContextProvider>
  </>
);

export default App;
