import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getCartItems, payProducts, removeCartItem } from '../../store/thunkFunctions';
import CartTable from './Sections/CartTable';
/* eslint-disable */
const CartPage = () => {
  //유저 데이터 가져오기
  const userData = useSelector(state => state.user?.userData);
  const cartDetail = useSelector(state => state.user?.cartDetail);

  const dispatch = useDispatch();
  //총액 0으로 세팅
  const [total, setTotal] = useState(0);
    useEffect(() => {
    let cartItemIds = []
    if(userData?.cart && userData.cart.length > 0) {
      userData.cart.forEach(item => {
        cartItemIds.push(item.id);
      })
    }
    const body = {
      cartItemIds,
      userCart : userData.cart
    }
    //thunk
    dispatch(getCartItems(body))
  }, [dispatch, userData ])
  
  //카드 상태 (cartDetail이 변경될때마다 caculateTotal 변경)
  useEffect(() => {
    calculateTotal(cartDetail)
  },[cartDetail])

  //카드 상품 총액 계산
  const calculateTotal = (cartItems) => {
    let total_in = 0;
    // cartItems.map(item => total_in += item.price * item.quantity)
    if(cartItems.products){
      cartItems.products.map(item => total_in += item.price * item.quantity)
    }
    else {
      cartItems.map(item => total_in += item.price * item.quantity)
    }
    setTotal(total_in)
  }
  //카트 아이템 삭제
  const handleRemoveCartItem = (productId) => {
    dispatch(removeCartItem(productId));
  }

  const handlePaymentClick = () => {
    dispatch(payProducts({cartDetail}))
  }
  return (
    <section>
      <div className='text-center'>
        <h2 className='text-2xl'>나의 장바구니</h2>
      </div>

      {cartDetail?.length > 0 ?
        <>
        {/* 카트 테이블 생성 */}
        <CartTable products = {cartDetail} onRemoveItem = {handleRemoveCartItem}/>
          <div className='mt-10'>
            <p><span className='font-bold'>합계:</span>{total}원</p>
            <button
              className='text-white bg-black rounded-md hover:bg-gray-500 px-4 py-2 mt-5'
              onClick={handlePaymentClick}
            >
              결제하기
            </button>
          </div>
        </>
        :
        <p>장바구니가 비었습니다.</p>
      }
    </section>
  )
}

export default CartPage