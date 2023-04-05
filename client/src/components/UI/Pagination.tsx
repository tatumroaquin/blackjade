import { FC } from 'react';
import { usePagination, DOTS } from '../../hooks/use-pagination';
import classnames from 'classnames';
import styles from './Pagination.module.scss';

interface Pagination {
  dataLength: number;
  currentPage: number;
  pageLimit: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
  className: string;
}

export const Pagination: FC<Pagination> = ({
  dataLength,
  currentPage,
  pageLimit,
  siblingCount,
  onPageChange,
  className,
}) => {
  const pageRange = usePagination({
    dataLength,
    currentPage,
    pageLimit,
    siblingCount,
  });

  const goToPrevPage = () => {
    onPageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    onPageChange(currentPage + 1);
  };

  // const randomInt = (min: number, max: number): number => {
  //   return Math.floor(Math.random() * (max - min + 1) + min) ;
  // }

  const lastPage = Math.ceil(dataLength / pageLimit);

  return (
    <ul
      className={classnames(styles['container'], { [className]: !!className })}
    >
      <li
        key='prev'
        className={classnames(styles['item'], {
          [styles['disabled']]: currentPage === 1,
        })}
        onClick={goToPrevPage}
      >
        <div className={classnames(styles['arrow'], styles['left'])} />
      </li>

      {pageRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li
              key={index}
              className={classnames(styles['item'], styles['dots'])}
            >
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={index}
            className={classnames(styles['item'], {
              [styles['selected']]: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(+pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}

      <li
        key='next'
        className={classnames(styles['item'], {
          [styles['disabled']]: currentPage === lastPage,
        })}
        onClick={goToNextPage}
      >
        <div className={classnames(styles['arrow'], styles['right'])} />
      </li>
    </ul>
  );
};
