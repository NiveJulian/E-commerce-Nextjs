import Button from "../components/Button";
import { CartContext } from "../components/CartContext";
import Center from "../components/Center";
import Header from "../components/Herader";
import Input from "../components/Input";
import Table from "../components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-colums: 1.2fr 0.8fr;
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 80px;
    max-height: 80px;
  }
`;

const QuantityLabel = styled.span`
  padding: 0 3px;
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalNumber, setPostalNumber] = useState("");
  const [address, setAddress] = useState("");
  const [telefone, setTelefone] = useState("");
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/checkout", {
        name,
        email,
        city,
        postalNumber,
        address,
        country,
        telefone,
        cartProducts,
      });

      // Verifica si se recibió una URL de pago
      if (response.data && response.data.preference.sandbox_init_point) {
        // Almacena la URL de pago en el estado
        setPaymentUrl(response.data.preference.sandbox_init_point);
      }
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
    }
  };
  useEffect(() => {
    if(typeof window === 'undefined'){
      return
    }
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, [])
  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);
  useEffect(() => {
    if (cartProducts?.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    }
  }, [cartProducts]);
  function moreOfThisProduct(id) {
    addProduct(id);
  }
  function lessOfThisProduct(id) {
    removeProduct(id);
  }
  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  if (isSuccess) {

    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Tu pago fue efectuado satisfactoriamente</h1>
              <p>
                Te enviaremos un email cuando este en proceso de embarque
                tu pedido muchas gracias!
              </p>
              <hr/>
              <p><b>Equipo de shoes house</b> <a href="https://wa.me/message/TOXQZBPAJQ7EO1" $black>Whatsapp</a></p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }
  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Carrito</h2>
            {!cartProducts?.length && <div>Tu carrito está vacio</div>}

            {cartProducts?.length > 0 && (
              <Table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>
                          -
                        </Button>
                        <QuantityLabel>
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </QuantityLabel>
                        <Button onClick={() => moreOfThisProduct(product._id)}>
                          +
                        </Button>
                      </td>
                      <td>
                        $
                        {cartProducts.filter((id) => id === product._id)
                          .length * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td>{total}</td>
                  </tr>
                </tbody>
                <Button $primary $outline onClick={clearCart}>Eliminar todo el carrito</Button>

              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Informacion del pedido</h2>
              <form onSubmit={handleFormSubmit}>
                <Input
                  key={cartProducts._id}
                  type="text"
                  placeholder="Nombre"
                  name="name"
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />

                <Input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                />

                <Input
                  type="text"
                  placeholder="Provincia"
                  name="country"
                  value={country}
                  onChange={(ev) => setCountry(ev.target.value)}
                />
                <CityHolder>
                  <Input
                    type="text"
                    placeholder="Ciudad"
                    name="city"
                    value={city}
                    onChange={(ev) => setCity(ev.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Codigo Postal"
                    name="postalNumber"
                    value={postalNumber}
                    onChange={(ev) => setPostalNumber(ev.target.value)}
                  />
                </CityHolder>
                <Input
                  type="text"
                  placeholder="Direccion"
                  name="address"
                  value={address}
                  onChange={(ev) => setAddress(ev.target.value)}
                />

                <Input
                  type="text"
                  placeholder="Numero de telefono"
                  name="telefone"
                  value={telefone}
                  onChange={(ev) => setTelefone(ev.target.value)}
                />
                <input
                  type="hidden"
                  name="products"
                  value={cartProducts.join(",")}
                />
                <Button $black $block type="submit">
                  Continuar pedido
                </Button>
              </form>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
6;
