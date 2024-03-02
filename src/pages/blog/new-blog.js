import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Siderbar from '../../helpers/siderbar';
import withAuth from '@/customHook/withAuth';
import axios from 'axios';
import { uploadImages } from '@/customHook/uploadImage';
import dynamic from 'next/dynamic';
import { Loader1 } from '@/helpers/Loader';


const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });


const url = 'https://api.newworldtrending.com/blog';


const config = {
    readonly: false,
    enableDragAndDropFileToEditor: true,
    uploader: {
        insertImageAsBase64URI: false,
        imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
        withCredentials: false,
        format: 'json',
        method: 'POST',
        url: `https://api.newworldtrending.com/blog/file/upload`,
        prepareData: function (data) {

            data.append('file', data.get('files[0]'));
            return data;
        },
        isSuccess: function (resp) {
            // console.log("resp", resp)
            return !resp.error;
        },
        process: function (resp) {
            // console.log(resp)
            return {
                files: [resp.data],
                path: resp.path,
                baseurl: resp.baseurl,
                error: resp.error ? 1 : 0,
                msg: resp.msg
            };
        },
        defaultHandlerSuccess: function (data, resp) {
            const files = data.files || [];

            if (files.length) {
                //@ts-ignore
                this.selection.insertImage(data.baseurl, null, 250);
            }
        },
        defaultHandlerError: function (resp) {
            console.log("error occure", resp)
            //@ts-ignore
            this.events.fire('errorPopap', this.i18n(resp?.msg));
        }
    },



}


const BlogPage = () => {
    const route = useRouter();
    const editor = useRef(null);




    const initialData = {
        title: "",
        bannerImg: [],
        permalink: "",
        content: '',
        metaTitle: "",
        metaDescription: "",
        categories: [],
        tags: [],
        featuredImages: [],
        author: "",
        status: "draft",
        instagramLink: "https://www.instagram.com/newworld.trending/",
        youtubeLink: "https://youtube.com/@NWT_YT?feature=shared",
        facebookLink: "https://www.newworldtrending.com/",
        adminId: '',
        categoryId: '',
        isFeatured: false,
        trending: 0,
    };


    const [blogData, setBlogData] = useState(initialData);


    const [loading, setIsLoading] = useState(false)



    function handleMultipleImage(e) {
        const fileList = e.target.files;

        // Convert FileList to an array and update state
        const newImages = Array.from(fileList);
        setBlogData({
            ...blogData,
            featuredImages: newImages,
        });
    }

    function handleBannerImg(e) {
        // console.log(e.target.)
        const fileList = [e.target.files[0]]
        setBlogData({
            ...blogData,
            bannerImg: fileList
        })
    }

    const handleInputChange = (field, value) => {
        setBlogData({
            ...blogData,
            [field]: value,
        });
    };

    const handleTitleChange = (e) => {
        setBlogData({
            ...blogData,
            title: e.target.value,
            metaTitle: e.target.value,
        })
    }


    const handleCheckboxChange = (e) => {
        setBlogData({

            ...blogData,
            trending: e.target.checked ? 1 : 0
        })
    };



    async function handleAddBlog(e) {
        setIsLoading(true)
        e.preventDefault()
        // console.log(blogData)
        const uploadBanner = await uploadImages(blogData.bannerImg)
        const UploadedImg = await uploadImages(blogData.featuredImages)

        try {
            const res = await axios.post(url + '/add_blog', { ...blogData, featuredImages: UploadedImg, bannerImg: uploadBanner })

            // console.log(res)
            alert(res.data.message)
            if (res.data?.message?.length > 0) {
                setBlogData(initialData)
            }
        }
        catch (err) {
            console.log(err)
            setIsLoading(false)
        }
        setIsLoading(false)

    }

    const [categories, setCategories] = useState([])



    async function fetchCategories() {
        try {
            const res = await axios.get(url + '/category');
            // console.log(res.data)
            setCategories(res.data.categories)
        }
        catch (err) {
            console.log(err)
            setCategories([])
        }
    }


    async function handleUpdateBlog() {
        setIsLoading(true)
        try {
            const res = await axios.post('https://ai.keyword.extractor.newworldtrending.com/get-key', {
                "text": blogData.title + ' ' + blogData.metaDescription
            })
            console.log(res.data.keyword_data)
            setBlogData({
                ...blogData,
                categories: res?.data?.keyword_data[0],
                tags: res?.data?.keyword_data[1],

            })
        }
        catch (err) {
            console.log(err)
        }

        setIsLoading(false)
    }



    useEffect(() => {

        fetchCategories()
        setBlogData({
            ...blogData,
            adminId: sessionStorage.getItem('userId')
        })
    }, [])

    return (
        <>
            {
                loading ?
                    <Loader1 />
                    :
                    <>

                        <Siderbar />
                        <div>
                            <div className="col-md-12 d-flex flex-column align-items-center justify-content-center">

                                <form onSubmit={handleAddBlog}>
                                    <div className="card md-12">
                                        <div className="card-body row container gx-4 gy-4">

                                            <div className="pt pb-2">
                                                <h5 className="card-title text-center pb-0 fs-4">Add Blog Here</h5>
                                            </div>

                                            <div className="md-12">
                                                <label htmlFor="title" className="form-label"> Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="title"
                                                    value={blogData.title}
                                                    required
                                                    onChange={(e) => handleTitleChange(e)}
                                                />
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="formFile" className="form-label">Banner Image</label>
                                                <input
                                                    type="file"
                                                    className="form-control-file"
                                                    id="formFile"
                                                    required
                                                    onChange={(e) => handleBannerImg(e)}
                                                />
                                            </div>

                                            <div className="md-12">
                                                <label htmlFor="content" className="form-label">Content</label>

                                                <JoditEditor
                                                    ref={editor}

                                                    config={config}
                                                    autofoucus={true}
                                                    value={blogData.content}
                                                    tabIndex={-1} // tabIndex of textarea

                                                    required
                                                    onChange={newContent => { handleInputChange('content', newContent); }}
                                                >

                                                </JoditEditor>

                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="Meta Title" className="form-label">Meta Title</label>
                                                <input
                                                    className="form-control"
                                                    id="metaTitle"
                                                    value={blogData.metaTitle}
                                                    required
                                                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                                                />
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="metaDescription" className="form-label">Meta Description</label>
                                                <textarea
                                                    className="form-control"
                                                    id="metaDescription"
                                                    value={blogData.metaDescription}
                                                    required
                                                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                                                ></textarea>
                                            </div>

                                            <div className="col-md-12">
                                                <label htmlFor="categories" className="form-label">
                                                    Category
                                                </label>
                                                <select className="form-select" id="categories"
                                                    required
                                                    onChange={(e) => handleInputChange('categoryId', e.target.value)}>
                                                    <option value="">Select Category</option>
                                                    {categories.length > 0 &&
                                                        categories.map((cate) => (
                                                            <option key={cate.id} value={cate.id}>
                                                                {cate.name}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                            <div className="md-4">
                                                {(blogData.title && blogData.metaDescription) && <button
                                                    className="btn btn-primary"

                                                    onClick={() => handleUpdateBlog()}
                                                >
                                                    Generate
                                                </button>}
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="categories" className="form-label">Keywords</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="categories"
                                                    value={blogData.categories.join(', ')}
                                                    required
                                                    onChange={(e) => handleInputChange('categories', e.target.value.split(', '))}
                                                />
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="tags" className="form-label">Tags</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="tags"
                                                    value={blogData.tags.join(', ')}
                                                    required
                                                    onChange={(e) => handleInputChange('tags', e.target.value.split(', '))}
                                                />
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="featuredImages" className="form-label">Featured Images</label>
                                                <input
                                                    type="file"
                                                    className="form-control-file"
                                                    id="featuredImages"
                                                    multiple
                                                    required
                                                    onChange={(e) => handleMultipleImage(e)}
                                                />
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="author" className="form-label">Author</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="author"
                                                    value={blogData.author}
                                                    required
                                                    onChange={(e) => handleInputChange('author', e.target.value)}
                                                />
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="status" className="form-label">Status</label>
                                                <select
                                                    className="form-select"
                                                    id="status"
                                                    value={blogData.status}

                                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                                >
                                                    <option value="published">Published</option>
                                                    <option value="draft">Draft</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={blogData.trending}
                                                        onChange={handleCheckboxChange}
                                                    />
                                                    Mark as Featured
                                                </label>
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="instagramLink" className="form-label">Instagram Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="instagramLink"
                                                    value={blogData.instagramLink}
                                                    required
                                                    onChange={(e) => handleInputChange('instagramLink', e.target.value)}
                                                />
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="youtubeLink" className="form-label">YouTube Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="youtubeLink"
                                                    value={blogData.youtubeLink}
                                                    required
                                                    onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                                                />
                                            </div>
                                            <div className="md-12">
                                                <label htmlFor="facebookLink" className="form-label">Facebook Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="facebookLink"
                                                    value={blogData.facebookLink}
                                                    required
                                                    onChange={(e) => handleInputChange('facebookLink', e.target.value)}
                                                />
                                            </div>
                                            <br />
                                            <div className="d-flex justify-content-center mt-5">
                                                {/* <button className="btn btn-primary" onClick={() => console.log('Edit clicked')}>
                                    Edit
                                </button> */}
                                                <button
                                                    className="btn btn-primary"
                                                    type='submit'
                                                >
                                                    Add Blog
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
            }
        </>
    );
};

export default withAuth(BlogPage);







