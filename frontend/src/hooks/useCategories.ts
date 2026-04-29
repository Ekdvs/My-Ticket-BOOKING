import { useEffect, useState } from "react";
import axios from "axios";
import { CATEGORY_META } from "../config/categoryMeta";

export interface NavCategory {
  key: string;
  label: string;
  icon: any;
  color: string;
  sub: string[];
}

export const useCategories = () => {
  const [categories, setCategories] = useState<NavCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/meta/categories");
        const data = res.data;

        const mapped: NavCategory[] = Object.entries(data || {}).map(
          ([key, value]) => ({
            key,
            label: CATEGORY_META[key]?.label || key,
            icon: CATEGORY_META[key]?.icon,
            color: CATEGORY_META[key]?.color || "#999",

            // ✅ FULL SAFE NORMALIZATION
            sub: Array.isArray(value)
              ? value.filter((v) => typeof v === "string")
              : [],
          })
        );

        setCategories(mapped);
      } catch (err) {
        console.error("Category fetch error", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return categories;
};