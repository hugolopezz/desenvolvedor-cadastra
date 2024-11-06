import React, { useEffect, useState } from "react";
import { useMinicartActions } from "../../context";
import { useProductsByPage } from "../../hooks/useProductsByPage";
import { CloseMinicartIcon } from "../../img";

const ProductCatalog = () => {
  const { productItems, loadMore, isLastItems } = useProductsByPage();
  const { handleAddToCart, toggleMinicartVisibility } = useMinicartActions();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isMobileFilterVisible, setIsMobileFilterVisible] = useState(false);
  const [isMobileOrderVisible, setIsMobileOrderVisible] = useState(false);

  const [filters, setFilters] = useState({
    selectedColors: [] as string[],
    selectedSizes: [] as string[],
    maxPrice: 0,
    minPrice: 0,
    highestPrice: 0,
  });

  const shouldShowLoadMore =
    !isLastItems &&
    filters.selectedColors.length === 0 &&
    filters.selectedSizes.length === 0;

  function formatValue(value: number): string {
    const formattedValue = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
    return formattedValue;
  }

  useEffect(() => {
    if (productItems.length) {
      const prices = productItems.map(({ price }) => price);
      setFilters((prev) => ({
        ...prev,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        highestPrice: Math.max(...prices),
      }));
    }
  }, [productItems]);

  const toggleSelection = (
    value: string,
    key: "selectedColors" | "selectedSizes"
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((selectedValue) => selectedValue !== value)
        : [...prev[key], value],
    }));
  };

  const filteredProducts = productItems.filter(({ color, size, price }) => {
    const { selectedColors, selectedSizes, maxPrice } = filters;
    const matchesColor =
      !selectedColors.length || selectedColors.includes(color);
    const matchesSize =
      !selectedSizes.length ||
      selectedSizes.some((selectedSize) => size.includes(selectedSize));
    return matchesColor && matchesSize && (!maxPrice || price <= maxPrice);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  return (
    <div className="category__section">
      <div className="filterPrice">
        <h3 className="title">Category</h3>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Menor Preço</option>
          <option value="desc">Maior Preço</option>
        </select>
        <div
          className={`selectOrder ${
            isMobileOrderVisible ? "activeMobile" : ""
          }`}
        >
          <div className="header__section">
            <h3>ORDENAR</h3>
            <CloseMinicartIcon onClick={() => setIsMobileOrderVisible(false)} />
          </div>
          <div className="select__section">
            <span
              onClick={() => {
                setSortOrder("asc");
                setIsMobileOrderVisible(false);
              }}
            >
              Menor Preço
            </span>
            <span
              onClick={() => {
                setSortOrder("desc");
                setIsMobileOrderVisible(false);
              }}
            >
              Maior Preço
            </span>
          </div>
        </div>
      </div>
      <div className="category__section--center">
        <aside
          className={`filters ${isMobileFilterVisible ? "activeMobile" : ""}`}
        >
          <div className="header__section">
            <h3>FILTRAR</h3>
            <CloseMinicartIcon
              onClick={() => setIsMobileFilterVisible(false)}
            />
          </div>

          {["Cores", "Tamanhos"].map((filterType) => (
            <div key={filterType} className="filter">
              <h3>{filterType}</h3>
              <div
                className={
                  "options " + (filterType === "Cores" ? "colors" : "sizes")
                }
              >
                {Array.from(
                  new Set(
                    productItems.flatMap((product) =>
                      filterType === "Cores" ? product.color : product.size
                    )
                  )
                ).map((option) => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      value={option}
                      checked={
                        filterType === "Cores"
                          ? filters.selectedColors.includes(option)
                          : filters.selectedSizes.includes(option)
                      }
                      onChange={() =>
                        toggleSelection(
                          option,
                          filterType === "Cores"
                            ? "selectedColors"
                            : "selectedSizes"
                        )
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="filter">
            <h3>Preço Range</h3>
            <input
              type="range"
              min={filters.minPrice}
              max={filters.highestPrice}
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxPrice: +e.target.value }))
              }
              step="10"
            />
            <div>{formatValue(filters.maxPrice)}</div>
          </div>
        </aside>
        <div className="filters__section--mobile">
          <div
            className="filter--mobile"
            onClick={() => setIsMobileFilterVisible(true)}
          >
            Filtrar
          </div>
          <div
            className="order--mobile"
            onClick={() => setIsMobileOrderVisible(true)}
          >
            Ordenar
          </div>
        </div>
        <section className="product-catalog">
          <div className="grid">
            {sortedProducts.map(({ id, image, name, price, parcelamento }) => (
              <div key={id} className="card">
                <img src={image} alt={name} className="image" />
                <div className="details">
                  <h4>{name}</h4>
                  <p>{formatValue(price)}</p>
                  <p>
                    em {parcelamento[0]}x de{" "}
                    {formatValue(price / parcelamento[0])}
                  </p>
                  <button
                    onClick={() => {
                      handleAddToCart(id);
                      toggleMinicartVisibility(true);
                    }}
                  >
                    COMPRAR
                  </button>
                </div>
              </div>
            ))}
          </div>

          {shouldShowLoadMore && (
            <button onClick={loadMore}>Carregar Mais</button>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductCatalog;
