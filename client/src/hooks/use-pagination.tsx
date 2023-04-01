import { useMemo } from 'react';

interface UsePagination {
  dataLength: number;
  currentPage: number;
  pageLimit: number;
  siblingCount?: number;
}

export const DOTS = '...';

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
};

export const usePagination = ({
  dataLength,
  currentPage,
  pageLimit,
  siblingCount = 1,
}: UsePagination) => {
  const pageRange = useMemo(() => {
    const totalPageCount = Math.ceil(dataLength / pageLimit);
    //firstPage + currentPage + lastPage + 2*DOTS = 5
    const totalPagePills = 5 + 2 * siblingCount;

    if (totalPageCount <= totalPagePills) {
      return range(1, totalPageCount);
    }

    const leftMostSiblingIndex = Math.max(1, currentPage - siblingCount);
    const rightMostSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const showLeftDots = leftMostSiblingIndex > 2;
    const showRightDots = rightMostSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!showLeftDots && showRightDots) {
      // [1, 2, 3, 4, 5, ..., 100]
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(firstPageIndex, leftItemCount);
      return [...leftRange, DOTS, lastPageIndex];
    }

    if (showLeftDots && !showRightDots) {
      // [1, ..., 96, 97, 98, 99, 100]
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // [1, ..., 49, 50, 51, ..., 100]
    const middleRange = range(leftMostSiblingIndex, rightMostSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }, [dataLength, currentPage, pageLimit, siblingCount]);
  return pageRange;
};
