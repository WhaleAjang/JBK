import CardItem from "./Sections/CardItem"
import CheckBox from "./Sections/CheckBox"
import RadioBox from "./Sections/RadioBox"
import SearchInput from "./Sections/SearchInput"
import axiosInstance from '../../utils/axios';
import { useEffect, useState } from "react";
import { continents, prices } from "../../utils/filterData";

const LandingPage = () => {

  //더보기를 위한 state 정의
  const limit = 4;
  //검색을 위한 state 정의
  const [searchTerm, setsearchTerm] = useState('');
  //product들을 저장하는 배열
  const [products, setProducts] = useState([]);
  //0은 초기 (맨 처음 데이터) 초기 skip 값은 0
  const [skip, setSkip] = useState(0)
  //hasmore : 더 보여줄 게 있을 때만 더보기 버튼이 활성화
  const [hasMore, sethasMore] = useState(false)
  //체크박스 선택  continets[] -> checkedContinents
  const [filters, setfilters] = useState({
    continents: [],
    price: []
  })
  //ex) filters[continents] = [1,2,3,4 ...]

  //처음 마운트 될 때 한번만 실행하게 된다 [] 빈배열
  useEffect(() => {
    fetchProducts({skip, limit});
  }, [])
  
  //초기에 보여줄 product들 디비에서 가져오기
  const fetchProducts = async ({skip, limit, loadMore=false, filters = {}, searchTerm=""}) => {
    const params = {
      skip,
      limit,
      filters,
      searchTerm
    }
    try {
      const response = await axiosInstance.get('/products', {params})
      
      //response를 기존 상품 state에 업데이트 해주기
      //response로 받아온 product들이 하나씩 products에 들어간다
      if(loadMore) {
        setProducts([...products, ...response.data.products])
      } else {
        //처음 들어왔을 때
        setProducts(response.data.products);
      }
      sethasMore(response.data.hasMore);
      
    } catch(error) {
      console.error(error)
    }
  }
  //더보기 기능 한 줄에 4개씩 보여주기깐 limit(=4) 만큼 스킵
  //loadmore할 때마다 0이었던 skip 값이 4씩 늘어난다
  const handleLoadMore = () => {
    const body = {
      skip : skip + limit,
      limit,
      loadMore: true,
      filters,
      searchTerm
    }
    fetchProducts(body);
    setSkip(skip + limit)
  }

  const handleFilters = (newFilteredData, category) => {
    const newFilters = {...filters};
    newFilters[category] = newFilteredData;
    if(category === 'price'){
      const priceValues = handlePrice(newFilteredData);
      newFilters[category] = priceValues
    }
    showFilteredResults(newFilters);
    setfilters(newFilters);
   }
   //선택한 prices id를 기반으로 배열 값 가져오기
   const handlePrice = (value) => {
    let array = [];
    for (let key in prices){
      if(prices[key]._id === parseInt(value, 10)){
        array = prices[key].array
      }
    }
    //[0,199]
    return array;
   }
   const showFilteredResults = (filters) => {
      const body = {
        //필터링 된 정보는 처음 아이템부터 보여져야함
        skip : 0,
        limit,
        filters,
        searchTerm
      }

      fetchProducts(body);
      setSkip(0);
   }
   const handleSearchTerm = (event) => {
    const body = {
      skip: 0,
      limit,
      filters,
      searchTerm: event.target.value
    }
    setSkip(0);
    setsearchTerm(event.target.value);
    fetchProducts(body)
  }
  return (
    <section>
      <div className="text-center m-7">
        <h2>여행 상품 사이트</h2>
      </div>
      {/*filter*/}
      <div className="flex gap-3">
        <div className="w-1/2">
          <CheckBox continents={continents} checkedContinents ={filters.continents} 
            onFilters={filters => handleFilters(filters, "continents")}
          />
        </div>
        <div className="w-1/2">
          <RadioBox prices={prices} checkedPrice={filters.price}
            onFilters={filters => handleFilters(filters, "price")}
          />
        </div>
      </div>
      {/**Search */}
      <div className="flex justify-end mb-3">
        <SearchInput searchTerm={searchTerm} onSearch={handleSearchTerm} />
      </div>
      {/**Cards  상품리스트들을 화면에 보여주기*/}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/*product 배열 하나씩 순회하면서 나열*/}
        {products.map(product =>
        <CardItem product={product} key={product._id} />
          )}
      </div>
      {/**LoadMore hasMore 값이 true 일때만 버튼이 보임 */}
      {hasMore &&
        <div className="flex justify-center mt-5">
          <button
          onClick={handleLoadMore}
          className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500">
            더보기
          </button>
        </div>
      }
    </section>
  )
}

export default LandingPage