import React, { useRef, useEffect } from "react";
import { useMinicartActions } from "../../context";
import { CloseMinicartIcon } from "../../img";

export const MinicartComponent = () => {
  const {
    productsInCart,
    isCartEmpty,
    totalCartValue,
    handleRemoveFromCart,
    isMinicartOpen,
    toggleMinicartVisibility,
  } = useMinicartActions();

  const cartRef = useRef<HTMLDivElement>(null);

  function formatValue(value: number): string {
    const formattedValue = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });

    return formattedValue;
  }

  return (
    <aside
      className={`minicart minicart--${isMinicartOpen ? "visible" : "hidden"}`}
      ref={cartRef}
    >
      <header className="minicart__header">
        <h2 className="minicart__title">Carrinho</h2>
        <button
          className="minicart__closeBtn"
          onClick={() => toggleMinicartVisibility()}
        >
          <CloseMinicartIcon />
        </button>
      </header>
      <div className="minicart__wrapper">
        <div className="minicart__body">
          {isCartEmpty ? (
            <strong className="minicart__emptyMessage">
              Seu carrinho está vazio.
            </strong>
          ) : (
            <>
              <ul className="minicart__items">
                {productsInCart.map((item, index) => (
                  <li key={index} className="minicart__item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="minicart__image"
                    />
                    <div className="minicart__details">
                      <h4 className="minicart__itemTitle">{item.name}</h4>
                      <span className="minicart__quantity">
                        Quantidade {item.amount}
                      </span>
                      <strong className="minicart__price">
                        {formatValue(item.amount * item.price)}
                      </strong>
                    </div>
                    <button
                      className="minicart__removeBtn"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <CloseMinicartIcon />
                    </button>
                  </li>
                ))}
              </ul>
              <footer className="minicart__footer">
                <div className="minicart__subtotal">
                  <span>
                    Subtotal:
                    <strong className="minicart__total">
                      {formatValue(totalCartValue)}
                    </strong>
                  </span>
                </div>
                <button className="minicart__checkoutBtn">
                  Finalizar compra
                </button>
              </footer>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
