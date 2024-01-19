import Dropzone from 'react-dropzone'
import axiosInstance from '../utils/axios';

// eslint-disable-next-line
const FileUpload = ({ onImageChange, images }) => {
    console.log(images);
    const handleDrop = async (files) => {
        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/form-data'}
        }
        formData.append('file',files[0]);

        try {
            //backend로 전송할 데이터
            const response = await axiosInstance.post('/products/image', formData, config);
            //기존 이미지파일 배열에 추가
            onImageChange([...images, response.data.fileName]);
        } catch (error) {
            console.error(error);
        }

    }
    const handleDelete = (image) => {
        // eslint-disable-next-line
        const currentIndex = images.indexOf(image);
        let newImages = [...images];
        newImages.splice(currentIndex, 1);
        onImageChange(newImages);
    }
    console.log(images);
    return (
        <div className='flex gap-4'>
            <Dropzone onDrop={handleDrop}>
            {({getRootProps, getInputProps}) => (
                <section
                    className='min-w-[300px] h-[300px] border flex items-center justify-center'
                >
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className='text-3xl'>+</p>
                </div>
                </section>
            )}
            </Dropzone>
            <div className='flex-grow h-[300px] border flex items-center justify-center overflow-x-scroll overflow-y-hidden'>
            {/* eslint-disable-next-line */}
                {images.map(image => (
                    <div key={image} onClick={ () => handleDelete(image)}>
                        <img    
                            className='min-w-[300px] h-[300px]'
                            src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                            alt={image}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}


export default FileUpload