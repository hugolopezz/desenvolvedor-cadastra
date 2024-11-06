import React, { createContext, useEffect, useMemo, useState, useContext } from "react";
import { useProductsByPage } from "../hooks/useProductsByPage";
import { Product } from "../ts/Product";
import { MinicartContextData } from "./types";
import { ReactNode } from "react";

interface MinicartProps {
  children: ReactNode;
}

export const MinicartContext = createContext({} as MinicartContextData);

export function MinicartProvider({ children }: MinicartProps) {
  const { allProductsItems } = useProductsByPage();
  const [isMinicartOpen, setMinicartOpen] = useState(false);
  const [productsInCart, setProductsInCart] = useState<Product[]>(() => {
    const storedCart = localStorage.getItem("productsInCart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const handleCartChange = (productId: number, action: "add" | "remove") => {
    setProductsInCart((prevCart) => {
      const productInCart = prevCart.find((product) => product.id === productId);
      const productToAdd = allProductsItems.find((product) => product.id === productId);

      let updatedCart = [...prevCart];

      switch (action) {
        case "add":
          if (productInCart) {
            updatedCart = prevCart.map((product) =>
              product.id === productId ? { ...product, amount: product.amount + 1 } : product
            );
          } else if (productToAdd) {
            updatedCart.push({ ...productToAdd, amount: 1 });
          }
          break;

        case "remove":
          if (productInCart) {
            updatedCart = prevCart
              .map((product) =>
                product.id === productId ? { ...product, amount: product.amount - 1 } : product
              )
              .filter((product) => product.amount > 0);
          }
          break;

        default:
          return prevCart;
      }

      localStorage.setItem("productsInCart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const totalItemsInCart = useMemo(
    () => productsInCart.reduce((total, product) => total + product.amount, 0),
    [productsInCart]
  );

  const totalCartValue = useMemo(
    () => productsInCart.reduce((total, product) => total + product.amount * product.price, 0),
    [productsInCart]
  );
  const toggleMinicartVisibility = (open?: boolean) => {
    setMinicartOpen((prev) => (open === true ? true : !prev));
  };  
  
  return (
    <MinicartContext.Provider
      value={{
        productsInCart: productsInCart,
        handleAddToCart: (productId: number) => handleCartChange(productId, "add"),
        handleRemoveFromCart: (productId: number) => handleCartChange(productId, "remove"),
        totalItemsInCart: totalItemsInCart,
        totalCartValue: totalCartValue,
        toggleMinicartVisibility,
        isMinicartOpen: isMinicartOpen,
        isCartEmpty: productsInCart.length === 0,
      }}
    >
      {children}
    </MinicartContext.Provider>
  );
}

export const useMinicartActions = () => useContext(MinicartContext);
