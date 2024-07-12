import styled from "styled-components";
import Button from "./Button";
import CartIcon from "./icons/CartIcon";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div``;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-align: center;
  justify-content: center;
  border-radius: 10%;
  img {
    max-width: 100%;
    max-height: 100px;
    border-radius: 10%;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: 0.9rem;
  margin: 0;
  color: inherit;
  text-decoration: none;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
  padding: 5px;
  background-color: #fff;
  border-radius: 10px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin-top: 5px;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

export default function ProductBox({ _id, title, description, price, images }) {
    const {addProduct} = useContext(CartContext)
    const url = "/product/" + _id;
  return (
    <ProductWrapper>
      <WhiteBox key={_id} href={url}>
        <div>
          <img src={images[0]} />
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>${price}</Price>

          <Button onClick={() => addProduct(_id)} $primary $outline>
            <CartIcon />
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}
