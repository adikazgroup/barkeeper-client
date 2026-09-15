"use client";

import { Pagination } from "@/components/ui/pagination/Pagination";
import useUpdateSearchParam from "@/hooks/useUpdateSearchParam";

interface BlogPaginationProps {
  currentPage: number;
  limit: number;
  totalItems: number;
}

export function BlogPagination({
  currentPage,
  limit,
  totalItems,
}: BlogPaginationProps) {
  const updateSearchParam = useUpdateSearchParam();

  return (
    <div className="max-w-7xl mx-auto ">
      <Pagination
        currentPage={currentPage}
        pageSize={limit}
        totalItems={totalItems}
        showPageSizeOptions={false}
        align="between"
        onPageChange={(page) => updateSearchParam("page", page)}
        onPageSizeChange={() => {}}
      />
    </div>
  );
}
