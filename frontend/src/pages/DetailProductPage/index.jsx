import React, { useState } from 'react'
import { useEffect } from 'react';
import {useParams} from 'react-router-dom'
import axiosInstance from '../../utils/axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
const DetailProductPage = () => {

  const {productId} = useParams();
  //useState Null로 세팅
  const [product, setProduct] = useState(null);

  useEffect(() => {
    //백엔드에서 id에 해당하는 product fetch
    async function fetchProduct() {
      try {
        const response = await axiosInstance.get(`/products/${productId}?type=single`);
        console.log(response)
        setProduct(response.data[0])
      } catch (error) {
        console.error(error)
      }
    }
    //함수호출
    fetchProduct();
  }, [productId])  //productId가 바뀔 때마다 fetchProduct 호출

  if (!product) return null;
  return(
    <section>
      <div className='text-center'>
        <h1 className='p-4 text-2xl'>{product.title}</h1>
      </div>

      <div className='flex gap-4'>
        <div className='w-1/2'>
          {/**ProductImage 컴포넌트*/}
          <ProductImage product={product}/>
        </div>
        <div className='w-1/2'>
          {/**ProductInfo 컴포넌트 */}
          <ProductInfo product={product} />
        </div>
      </div>
    </section>
  )
}

export default DetailProductPage