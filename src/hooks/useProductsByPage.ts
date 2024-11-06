import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../ts/Product";

const ITEMS_PAGE = 6;

interface ProductResponse {
  data: Product[];
  headers: {
    [key: string]: string;
  };
}

export function useProductsByPage() {
  const [productItems, setProductItems] = useState<Product[]>([]);
  const [allProductsItems, setAllProductsItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalProductItems, setTotalProductItems] = useState<number | null>(null);

  const fetchProducts = useCallback(async (pageToSearch: number) => {
    try {
      const { data: pageItems, headers }: ProductResponse = await axios.get(
         `http://localhost:5000/products?_page=${pageToSearch}&_limit=${ITEMS_PAGE}`
      );
      const { data: all } = await axios.get(`http://localhost:5000/products`);

      setProductItems((prev) => (pageToSearch === 1 ? pageItems : [...prev, ...pageItems]));
      setAllProductsItems(all);
      setTotalProductItems(parseInt(headers["x-total-count"], 10));
    } catch (err) {
      setError(`Erro: ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const loadMore = useCallback(() => {
    if (totalProductItems && (page - 1) * ITEMS_PAGE < totalProductItems) {
      setPage((prev) => prev + 1);
    }
  }, [totalProductItems, page]);

  const isLastItems = totalProductItems !== null && page * ITEMS_PAGE >= totalProductItems;

  return { productItems, allProductsItems, error, loading, loadMore, isLastItems };
}
