import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { getImage } from '@/customHook/getImage';
import Siderbar from '@/helpers/siderbar';
import withAuth from '@/customHook/withAuth';
import { useRouter } from 'next/router';

const url = 'https://api.newworldtrending.com/blog';

const redirect_url = 'https://world.blog.newworldtrending.com/blog/'

const MUITable = () => {

  const router = useRouter()

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);


  function titleToSlug(title) {
    // Convert to lowercase and replace spaces with dashes
    const slug = title.toLowerCase().replace(/\s+/g, '-');

    // Remove special characters and non-alphanumeric characters
    const cleanSlug = slug.replace(/[^\w-]/g, '');

    return cleanSlug;
  }

  // Example usage:
  const title = "Create a Function to Replace Title into Slug in JS";
  const slug = titleToSlug(title);
  console.log(slug);


  const columns = [
    { label: 'ID', name: 'id' },
    {
      label: 'Edit Blog',
      name: 'title',
      options: {
        customBodyRender: (value, tableMeta) => (
          <div title={value} className='btn btn-primary' onClick={() => {
            const blogId = tableMeta.rowData[0];
            router.replace('/blog/'+blogId+'/edit');
          }}>
            <i
              className="fa fa-edit"
              style={{cursor:'pointer'}}
            ></i>
          </div>
        ),
      },
    },
    {
      label: 'Banner',
      name: 'banner',
      options: {
        customBodyRender: (value) => (
          <img src={value} alt="Banner" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        ),
      },
    },
    {
      label: 'Title',
      name: 'title',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value?.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
    
    {
      label: 'NWLink',
      name: 'title',
      options: {
        customBodyRender: (value, tableMeta) => (
          <div title={value} className='btn btn-primary' onClick={() => {
            const blogId = tableMeta.rowData[0]; // Assuming ID is in the first column
            router.push('  https://newworldtrending.com/blog/' + blogId + '/' + titleToSlug(value));
          }}>
            <i
              className="fa fa-desktop "
              
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
        ),
      },
    },
    {
      label: 'Author',
      name: 'author', 
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
    {
      label: 'Content',
      name: 'content',
      options: {
        customBodyRender: (value) => (
          <div title={value} dangerouslySetInnerHTML={{ __html:  value.length > 30 ? `${value.slice(0, 30)}...` : value  }}></div>
        ),
      },
    },
    {
      label: 'Meta Title',
      name: 'metaTitle',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
    {
      label: 'Meta Description',
      name: 'metaDescription',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
    // {
    //   label: 'Categories',
    //   name: 'categories',
    //   options: {
    //     customBodyRender: (value) => (
    //       <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
    //     ),
    //   },
    // },
    // {
    //   label: 'Tags',
    //   name: 'tags',
    //   options: {
    //     customBodyRender: (value) => (
    //       <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
    //     ),
    //   },
    // },
    {
      label: 'Published Date',
      name: 'publishedDate',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
    {
      label: 'Status',
      name: 'status',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
    {
      label: 'Instagram Link',
      name: 'instagramLink',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
    {
      label: 'Youtube Link',
      name: 'youtubeLink',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
    {
      label: 'Facebook Link',
      name: 'facebookLink',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
        ),
      },
    },
  ];


  const options = {
    filterType: typeof window !== 'undefined' && window.innerWidth > 200 ? 'none' : 'none',
    responsive: 'standard',
    // setRowId: (rowData) => `custom-id-${rowData[0]}`, // Assuming the first column is the unique identifier (title in this case)
  };

  async function updateBannerUrls(blogArray) {
    const updatedBlogArray = [];

    for (const blog of blogArray) {
      const bannerUrls = await getImage(blog.banner);

      // Create a new blog object with updated banner URLs
      const updatedBlog = {
        ...blog,
        banner: bannerUrls[0], // Assuming getImage returns an array, use the first URL
      };

      updatedBlogArray.push(updatedBlog);
    }

    return updatedBlogArray;
  }

  async function fetchBlogList(user) {
    try {
      const res = await axios.get(url + '/get/' + user);

      // Call the updateBannerUrls function to update the banner field
      const updatedBlogRes = await updateBannerUrls(res.data.data);
      setBlogData(updatedBlogRes);
    } catch (err) {
      console.log(err);
      setBlogData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    fetchBlogList(userId);
  }, []);

  return (
    <>
      <Siderbar />
      <div className="container"> </div>
      <div style={{ width: 'auto', padding: '10px' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          blogData && (
            <MUIDataTable
              columns={columns}
              data={blogData}
              title='Your Written Blog Data'
              options={options}
            />
          )
        )}
      </div>
    </>
  );
};

export default withAuth(MUITable) ;
