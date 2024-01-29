import { useState } from 'react';
// import Sidebar from '@/helpers/sidebar';  // Assuming you have a Sidebar component
import withAuth from '@/customHook/withAuth';
import axios from 'axios';
import Siderbar from '@/helpers/siderbar';

const url = 'https://api.newworldtrending.com/blog';

const NewCategoryPage = () => {
  const initialData = {
    name: "",
    categoryId: 0,  
    adminId: sessionStorage.getItem('userId'),
  };

  const [categoryData, setCategoryData] = useState(initialData);

  const handleInputChange = (field, value) => {
    setCategoryData({
      ...categoryData,
      [field]: value,
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${url}/category/new`, categoryData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Siderbar />
      <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">
        <form onSubmit={handleAddCategory}>
          <div className="card md-12">
            <div className="card-body row container">
              <div className="pt pb-2">
                <h5 className="card-title text-center pb-0 fs-4">Add Main Category Here</h5>
              </div>
              <div className="md-12">
                <label htmlFor="name" className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={categoryData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              {/* <div className="md-12">
                <label htmlFor="categoryId" className="form-label">Category ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="categoryId"
                  value={categoryData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                />
              </div> */}
              <br />
              <div className="d-flex justify-content-center mt-5">
                <button
                  className="btn btn-secondary"
                  type="submit"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default withAuth(NewCategoryPage);
