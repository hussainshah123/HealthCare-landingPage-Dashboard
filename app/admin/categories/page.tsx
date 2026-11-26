"use client";

import type { Category } from "@/types/api";
import { createCategory, listCategories } from "@/lib/api/catalog";
import { SimpleCatalog } from "@/components/admin/simple-catalog";

export default function CategoriesPage() {
  return (
    <SimpleCatalog<Category>
      title="Categories"
      description="Medicine categories shown in the customer app."
      noun="Category"
      list={listCategories}
      create={createCategory}
      withImageUrl
      extraColumns={[
        {
          key: "image",
          header: "Image",
          cell: (c) =>
            c.imageUrl ? (
              <a href={c.imageUrl} target="_blank" rel="noreferrer" className="text-xs text-teal-700 hover:underline">
                View
              </a>
            ) : (
              "—"
            ),
        },
      ]}
    />
  );
}
