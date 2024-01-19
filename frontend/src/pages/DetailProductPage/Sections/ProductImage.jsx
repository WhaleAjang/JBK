import React, { useState } from 'react'
import { useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
//상품 이미지랑 썸네일 
const ProductImage = ({product}) => {
    const [images, setimages] = useState([]);

    useEffect(() => {
        //보여줄 이미지가 있을 때
      if(product?.images?.length > 0){
        let images = [];

        product.images.map(imageName => {
            return images.push({
                original: `${import.meta.env.VITE_SERVER_URL}/${imageName}`,
                thumbnail: `${import.meta.env.VITE_SERVER_URL}/${imageName}`,
            })
        })

        setimages(images)
      }  
    }, [product])
    


  return (
    <ImageGallery items={images} />
)
}

export default ProductImage