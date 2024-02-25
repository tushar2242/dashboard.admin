import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { getImage } from '@/customHook/getImage';
import Siderbar from '@/helpers/siderbar';
import withAuth from '@/customHook/withAuth';
import { useRouter } from 'next/router';
import { CSVLink } from 'react-csv';

import moment from 'moment';

const url = 'https://api.newworldtrending.com/blog';

const redirect_url = 'https://world.blog.newworldtrending.com/blog/';






const MUITable = () => {

  const router = useRouter()

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);


  function titleToSlug(title) {
    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const cleanSlug = slug.replace(/[^\w-]/g, '');

    return cleanSlug;
  }


  const generateCSVData = (data) => {
    return data.map(blog => [
      `https://newworldtrending.com/blog/${blog.id}/${titleToSlug(blog.title)}`,
    ]);
  };


  const columns = [
    { label: 'ID', name: 'id' },

    {
      label: 'Edit Blog',
      name: 'title',
      options: {
        customBodyRender: (value, tableMeta) => (
          <div title={value} className='btn btn-primary' onClick={() => {
            const blogId = tableMeta.rowData[0];
            router.replace('/blog/' + blogId + '/edit');
          }}>
            <i
              className="fa fa-edit"
              style={{ cursor: 'pointer' }}
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
      label: 'Published Date',
      name: 'publishedDate',
      options: {
        customBodyRender: (value) => (
          <div title={value}>{moment(value).format("Do MMM YY")}</div>
        ),
      },
    },

  ];


  const options = {
    filterType: 'dropdown',
    responsive: 'standard',
    textLabels: {
      body: {
        noMatch: 'No Records Found',
      },
    },
    print: false,
    download: false,
    pagination: false,
    rowsPerPageOptions: [100, 150, 200],

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
      setBlogData(updatedBlogRes.reverse());
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
      {/* <div className="container"> </div> */}
      <div className='table-vw-size mbvw-tbl-scrl'>
        <div style={{ width: 'auto', padding: '10px' }}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            blogData && (
              <MUIDataTable
                columns={columns}
                data={blogData}
                title={<div className="container row p-3">
                  <h6 className='row__title p-3 d-flex align-items-center'>
                    <div className='btn btn-outline-warning'>
                      <CSVLink
                        data={generateCSVData(blogData)}
                        filename={"website_url.csv"}
                      >
                        Download CSV
                      </CSVLink>
                    </div>
                    {/* <div className='btn btn-outline-warning'>
                      <CSVLink
                        data={generateCSVData(blogData)}
                        filename={"website_url.csv"}
                      >
                        Don't Download
                      </CSVLink>
                    </div> */}
                  </h6>
                </div>}
                options={options}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default withAuth(MUITable);

















// {
//   label: 'Content',
//   name: 'content',
//   options: {
//     customBodyRender: (value) => (
//       <div title={value} dangerouslySetInnerHTML={{ __html:  value.length > 30 ? `${value.slice(0, 30)}...` : value  }}></div>
//     ),
//   },
// },
// {
//   label: 'Meta Title',
//   name: 'metaTitle',
//   options: {
//     customBodyRender: (value) => (
//       <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
//     ),
//   },
// },
// {
//   label: 'Meta Description',
//   name: 'metaDescription',
//   options: {
//     customBodyRender: (value) => (
//       <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
//     ),
//   },
// },
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

//   {
//     label: 'Status',
//     name: 'status',
//     options: {
//       customBodyRender: (value) => (
//         <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
//       ),
//     },
//   },
//   {
//     label: 'Instagram Link',
//     name: 'instagramLink',
//     options: {
//       customBodyRender: (value) => (
//         <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
//       ),
//     },
//   },
//   {
//     label: 'Youtube Link',
//     name: 'youtubeLink',
//     options: {
//       customBodyRender: (value) => (
//         <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
//       ),
//     },
//   },
//   {
//     label: 'Facebook Link',
//     name: 'facebookLink',
//     options: {
//       customBodyRender: (value) => (
//         <div title={value}>{value.length > 30 ? `${value.slice(0, 30)}...` : value}</div>
//       ),
//     },
//   },