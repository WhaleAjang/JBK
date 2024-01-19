import { useState } from 'react'
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../../components/FileUpload'

const continents = [
  {key: 1, value: 'Africa'},
  {key: 2, value: 'Europe'},
  {key: 3, value: 'Asia'},
  {key: 4, value: 'North America'},
  {key: 5, value: 'South America'},
  {key: 6, value: 'Australia'},
  {key: 7, value: 'Antarctica'},

]
const UploadProductPage = () => {
  {/**usestate snippet? */}
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: 0,
    continents: 1,
    images: []
  });
  console.log(product);
  //리덕스에 저장되어 있는 userData 정보 가져오기 (writer값에 참조된다)
  const userData = useSelector(state => state.user?.userData);
  const navigate = useNavigate()
  
  {/**입력할 때 변화를 체크하는 함수 */}
  const handleChange = (event) => {
    const {name, value} = event.target;
    setProduct((prevState) => ({
      // 원래 있던 값을 펼쳐준다
      ...prevState,
      //name : 입력 이름 (ex price) value : 입력값
      [name] : value
    }))
  }

    //파일 업로드 함수
    //images: [] 배열부분을 바꿔준다
    const handleImages = (newImages) => {
      setProduct((prevState) => ({
        // 원래 있던 값을 펼쳐준다
        ...prevState,
        images: newImages
      }))
    }

  const handleSubmit = async (event) => {
    //버튼을 눌러서 제출했을 때 페이지가 refresh 되는 것을 막는다
    event.preventDefault();
    //product 값을 destructing 해서 개별 변수로 사용할 수 있게 한다
    //const {title, description, price, images, continents} = product;

    const body = {
      writer: userData.id,
      //title,description,price,images,continents
      //다른 방법
      ...product
       // : prduct 값을 그대로 body에 각각 넣어준다 destructing할 필요도 없다
    }
    try {
      await axiosInstance.post('/products', body);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }
  console.log(product.images);
  return (
    <section>
      <div className='text-center m-7'>
        <h1>예상 상품 업로드</h1>
      </div>
      
      <form className='mt-6' onSubmit={handleSubmit}>
        <FileUpload images={product.images} onImageChange={handleImages}/>
        <div className='mt-4'>
          <label htmlFor='title'>이름</label>
          <input
            className='w-full px-4 py-2 bg-white border rounded-mb'
            name='title' id='title' onChange={handleChange} value={product.title}
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='description'>설명</label>
          <input
            className='w-full px-4 py-2 bg-white border rounded-mb'
            name='description' id='description' onChange={handleChange} value={product.description}
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='price'>가격</label>
          <input
            className='w-full px-4 py-2 bg-white border rounded-mb'
            type="number" name='price' id='price' onChange={handleChange} value={product.price}
          />
        </div>

        <div className='mt-4'>
          <label htmlFor='continents'>지역</label>
          <select
            className='w-full px-4 mt-2 bg-white border rounded-md' 
            name='continents' id='continents' onChange={handleChange} value={product.continents}>
            {/* *지역 선택하기 옵션 생성한 리스트 mapping */}
            {continents.map(item => (
              <option key={item.key} value={item.key}>{item.value}</option>
            ))}  
          </select>
        </div>

      <div className='mt-4'>
      <button 
      type='submit'
      className='w-full px-4 text-white bg-black rounded-md hover:bg-gray-800'>
        생성하기
      </button>
      </div>
      </form>
    </section>
  )
}

export default UploadProductPage