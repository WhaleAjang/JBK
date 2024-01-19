/* eslint-disable */
import React from 'react'

const CheckBox = ({continents, checkedContinents, onFilters}) => {
  const handleToggle = (continentId) => {
    //현재 누른 checkbox가 이미 누른 checkbox인지 체크
    const currentIndex = checkedContinents.indexOf(continentId);
    const newChecked = [...checkedContinents]
    //체크가 안되었다 배열에 없는 값의 index : -1
    if(currentIndex == -1) {
      newChecked.push(continentId);
    }else {
      //이미 있는 값은 splice를 통해 제거
      newChecked.splice(currentIndex, 1);
    }
    onFilters(newChecked);
  }
  return (
    <div className='p-2 mb-3 bg-gray-100 rounded-md'>
      {continents?.map(continent => (
        <div key={continent._id}>
          <input
            type='checkbox'
            onChange={() => handleToggle(continent._id)}
          />{" "} 
          <label>{continent.name}</label>
        </div>
      ))}
    </div>
  )
}

export default CheckBox