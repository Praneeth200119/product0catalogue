import { FaRegEdit } from "react-icons/fa";
import { Tooltip } from 'react-tooltip'
import { FaInfoCircle } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import './styles.css'

const  Previews = (props) =>{
    const {products, editPreview} = props

    const productsLength = products.length
    

  const handleEdit = (id) =>{
    const item = products.filter(each => each.product_id == id)
    editPreview(id, item)
  }


    return(
        productsLength >= 1 &&
        (<div className="pre-container">
          <table className='product-table'>
      <thead className='table-columns'>
        <tr>
          <th>ID</th>
          <th>Product Name</th>
          <th>Brand</th>
          <th>Categories</th>
          <th className='table-nutrition'>Weights</th>
          <th className='table-description'>Description</th>
          <th className='table-nutrition'>Nutrition</th>
          <th className='table-ingredients'>Ingredients</th>
          <th className='cols-with-max-width'>Dietary</th>
          <th className='cols-with-max-width'>Storage</th>
          <th className='cols-with-max-width'>Origin</th>
          <th>Images</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={index}>
            <td>{product.product_id}</td>
            <td>{product.product_name}</td>
            <td>{product.product_brand}</td>
            <td>
              <p className='preview-category'>Super Category: <span className='category-span'>{product.super_category}</span></p>
              <p className='preview-category'>Category: <span className='category-span'>{product.category}</span></p>
              <p className='preview-category'>Sub Category: <span className='category-span'>{product.sub_category}</span></p>
            </td>
            <td className='table-nutrition'>
                <p className='preview-nutrition preview-weights'>No Of Units:<span className='category-span'>{product.no_of_units}</span></p>
                <p className='preview-nutrition preview-weights'>Unit Weight:<span className='category-span'>{product.unit_weight}</span></p>
                <p className='preview-nutrition preview-weights'>Net Weight:<span className='category-span'>{product.net_weight}</span></p>
                <p className='preview-nutrition preview-weights'>Gross Weight:<span className='category-span'>{product.gross_weight}</span></p>
            </td>
            <td className='table-description'>{product.description}</td>
            <td className='table-nutrition'>
              <div className='half-nutrition'>
                <p className='preview-nutrition'>Calories:<span className='category-span'>{product.calories}</span></p>
                <p className='preview-nutrition'>Fat:<span className='category-span'>{product.fat}</span></p>
                <p className='preview-nutrition'>SF:<span className='category-span'>{product.saturated_fat}</span></p>
                <p className='preview-nutrition'>Carbs:<span className='category-span'>{product.carbs}</span></p>
              </div>
              <div>
                <p className='preview-nutrition'>Fiber:<span className='category-span'>{product.fiber}</span></p>
                <p className='preview-nutrition'>Sugar:<span className='category-span'>{product.sugar}</span></p>
                <p className='preview-nutrition'>Protein:<span className='category-span'>{product.protien}</span></p>
                <p className='preview-nutrition'>Salt:<span className='category-span'>{product.salt}</span></p>
              </div>
            </td>
            <td className='table-description table-ingredients'>{product.ingredients}</td>
            <td className='cols-with-max-width field-value'>{product.dietary}</td>
            <td className='cols-with-max-width field-value'>{product.storage}</td>
            <td className='cols-with-max-width field-value'>{product.origin}</td>
            <td>
              <div className="preview-images-container">
                {
                  product.images.map(each => (
                    <img src={each} alt={'product Image'} key={uuidv4()} style={{ width: 75, height: 75 }} />
                  ))
                }
              </div>
            </td>
            <td>
              <button className="edit-button" onClick={() => handleEdit(product.product_id)}><FaRegEdit size="30"/></button>
              <a 
                data-tooltip-id="my-tooltip"
                data-tooltip-content={product.username}
                data-tooltip-place="top"
              >
                <FaInfoCircle size="30"/>
              </a>
              <Tooltip id="my-tooltip" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>) 
        
    )

}
    

export default Previews

