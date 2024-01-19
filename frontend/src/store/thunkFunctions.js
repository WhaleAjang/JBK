import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

//함수를 반환할 수 있다
//dispatch : action을 reducer로 보내는 거
//백엔드에 API 요청
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (body,thunkAPI) => {
        try{
            //post method를 이용하여 /users/register 서버로 전송함
            const response = await axiosInstance.post(
                '/users/register',
                body
            )
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (body,thunkAPI) => {
        try{
            //post method를 이용하여 /users/register 서버로 전송함
            const response = await axiosInstance.post(
                '/users/login',
                body
            )
            //백엔드의 응답을 받아야됨
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const authUser = createAsyncThunk(
    //type prefix
    "user/authUser",
    //받아오는 인수 없으니깐 첫번째 매개변수 : _ , thunkAPI는 무조건 두번쨰변수
    async (_, thunkAPI) => {
        try{
            //get method를 이용하여 /users/auth 서버로 전송함
            const response = await axiosInstance.get(
                //endpoint -> server에서 처리하게되는 api
                '/users/auth'
            );
            //백엔드의 응답을 받아야됨
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const logoutUser = createAsyncThunk(
    //type prefix
    "user/logoutUser",
    //받아오는 인수 없으니깐 첫번째 매개변수 : _ , thunkAPI는 무조건 두번쨰변수
    async (_, thunkAPI) => {
        try{
            //post method를 이용하여 /users/logout 서버로 전송함
            const response = await axiosInstance.post(
                //endpoint -> server에서 처리하게되는 api
                '/users/logout');
            //백엔드의 응답을 받아야됨
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const addToCart = createAsyncThunk(
    //type prefix
    "user/addToCart",
    //product id 받아옴, thunkAPI는 무조건 두번쨰변수
    async (body, thunkAPI) => {
        try{
            //post method를 이용하여 /users/logout 서버로 전송함
            const response = await axiosInstance.post(
                //endpoint -> server에서 처리하게되는 api
                '/users/cart',
                body 
                );

            //백엔드의 응답을 받아야됨
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

export const getCartItems = createAsyncThunk(
    //type prefix
    "user/getCartItems",
    //body : carItemIds & userCart, thunkAPI는 무조건 두번쨰변수
    async ({cartItemIds, userCart}, thunkAPI) => {
        try{
            //post method를 이용하여 /users/logout 서버로 전송함
            const response = await axiosInstance.get(
                //endpoint -> server에서 처리하게되는 api
                `/products/${cartItemIds}?type=array`);
                //유저 데이터와 product 데이터 합쳐주기
                userCart.forEach(cartItem => {
                    response.data.forEach((productDetail, index) => {
                        if(cartItem.id === productDetail._id){
                            response.data[index].quantity=cartItem.quantity;
                        }
                    })
                })

            //백엔드의 응답을 받아야됨 (action의 payload로 넣어줌)
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

//카트 아이템 삭제
export const removeCartItem = createAsyncThunk(
    //type prefix
    "user/removeCartItems",
    async (productId, thunkAPI) => {
        try{
            //user 데이터베이스에서 cart상품 삭제
            const response = await axiosInstance.delete(
                //endpoint -> server에서 처리하게되는 api
                `/users/cart?productId=${productId}`
                );
                
            response.data.cart.forEach(cartItem => {
                response.data.productInfo.forEach((productDetail, index) => {
                    if (cartItem.id === productDetail._id){
                        response.data.productInfo[index].quantity = cartItem.quantity;
                    }
                })
            })
            //백엔드의 응답을 받아야됨 (action의 payload로 넣어줌)
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)

//결제
export const payProducts = createAsyncThunk(
    //type prefix
    "user/payProducts",
    async (body, thunkAPI) => {
        try{
            //user 데이터베이스에서 cart상품 삭제
            const response = await axiosInstance.post(
                //endpoint -> server에서 처리하게되는 api
                `/users/payment`,
                body
                );
            //백엔드의 응답을 받아야됨 (action의 payload로 넣어줌)
            return response.data;
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue(error.response.data || error.message);
        }
    }
)