import React from 'react'

const GenderCheckbox = () => {
  return (
    <div className='flex'>
        <div className='form-control'>
            <label className={`label grap-2 cursor-pointer`}>
                <span className='label-text'>Male</span>
                <input type="radio" name="radio-2" className="radio radio-primary" />
            </label>
        </div>
        <div className='form-control'>
            <label className={`label grap-2 cursor-pointer`}>
                <span className='label-text'>Female</span>
                <input type="radio" name="radio-2" className="radio radio-primary" />
            </label>
        </div>
      
    </div>
  )
}

export default GenderCheckbox;
