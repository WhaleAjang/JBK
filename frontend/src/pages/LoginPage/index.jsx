//import React from 'react'
import {useForm} from 'react-hook-form'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/thunkFunctions';

const LoginPage = () => {
  const {register,
    handleSubmit,
    formState: {errors},  //error : 유효성 통과 못할시 저장되는 에러
    reset  //호출시, 입력한 value들이 초기화된다
    } = useForm({mode: 'onChange'})

    //리덕스에서 action을 전달하는 방식
    const dispatch = useDispatch();


    const onSubmit = ({email, password}) => {
      //인자로 email, password, name를 받아온다
      const body = {
        email,
        password,
      }

      dispatch(loginUser(body))
      
      reset();   //마지막엔 reset
    }
    const userEmail = {
      required: "필수 필드입니다." 
    }
    const userPassword = {
      required: '필수 필드입니다.',
      minLength: {
        value: 6,
        message: "최소 6자입니댜."
      }
    }


  return (
    <section className='flex flex-col justify-center mt-20 max-w-[400px] m-auto'>
      <div className='p-6 bg-white rounded-md shadow-md'>
        <h1 className="text-3xl font-semibold text-center">
          로그인
        </h1>
        <form className='mt-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label
            htmlFor='email'
            className='text-sm font-semibold text-gray-800'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
              {...register('email',userEmail)}  //register(name,option)
              />
              {
                errors?.email &&
                <div>
                  <span className='text-red-500'>
                    {errors.email.message}
                  </span>
                </div>
              }
          </div>

          <div className='mb-2'>
            <label
            htmlFor='password'
            className='text-sm font-semibold text-gray-800'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              className='w-full px-4 py-2 mt-2 bg-white border rounded-md'
              {...register('password',userPassword)}
              />
              {
                errors?.password &&
                <div>
                  <span className='text-red-500'>
                    {errors.password.message}
                  </span>
                </div>
              }
          </div>
          <div className='mt-6'>
            <button type='submit' className='w-full px-4 py-2 text-white duration-200 transfrom bg-black rounded-md hover:bg-gray-700'>
              로그인
            </button>
          </div>
        </form>

        <p className='mt-8 text-xs font-light text-center text-gray-700'>
          {" "}아이디가 없다면?{" "}
          <a
          href='/register'
          className='font-medium hover:underline'>
            회원가입
          </a>
        </p>
      </div>
    </section>
  )
}

export default LoginPage