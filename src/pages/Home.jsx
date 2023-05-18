import React from 'react';
import axios from 'axios';
import qs from 'qs'

import { useDispatch, useSelector } from 'react-redux';
import { setCategoryId, setPageCount } from '../redux/slices/filterSlice';

import Categories from '../сomponents/Categories';
import Sort from '../сomponents/Sort';
import PizzaBlock from '../сomponents/PizzaBlock';
import Skeleton from '../сomponents/PizzaBlock/Skeleton';
import Pagination from '../сomponents/Pagination';
import { SearchContext } from '../App';

export default function Home() {
  const dispatch = useDispatch();
  const categoryId = useSelector((state) => state.filter.categoryId);
  const sortType = useSelector((state) => state.filter.sort.sortProperty);

  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsloading] = React.useState(true);

  const [currentPage, setCurrentPage] = React.useState(1);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = number => {
    dispatch(setPageCount(number))
  }

  React.useEffect(() => {
    setIsloading(true);
    
    const sortBy = sortType.sortProperty.replace('-', '');
    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    axios
      .get(
        `https://6419b14fc152063412c93ba7.mockapi.io/items?page=${currentPage}&limit=4&
        ${category}&sortBy=${sortBy}&order=${order}${search}`,
      )
      .then((res) => {
        setItems(res.data);
        setIsloading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);
  const sceletons = [...new Array(10)].map((_, index) => <Skeleton key={index}/>);
  
  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort/> {/*Нужно сдесь написать value={sortType end fuction onCheng} */}
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading ? sceletons : pizzas}
      </div>
      <Pagination onChangePage={onChangePage}/>
    </div>
  );
}