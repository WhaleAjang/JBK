import React from 'react'
import { Link } from 'react-router-dom';
import ImageSlider from '../../../components/ImageSlider';

const CardItem = ({ product }) => {
  return (
    <div className='border-[1px] border-gray-300'>
        <ImageSlider images={product.images}/>
        {/* 클릭하면 해당 제품의 상세페이지로 이동함 */}
        <Link to={`/product/${product._id}`}>
            <p className='p-1'>{product.title}</p>
            <p className='p-1'>{product.continents}</p>
            <p className='p-1 text-xs text-gray-500'>{product.price}</p>
        </Link>
    </div>
  )
}

export default CardItem