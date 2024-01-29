import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Siderbar = ({ children }) => {


    const [isOpen, setIsopen] = useState(false);
    const [openProfile, setProfile] = useState(false)

    const ToggleSidebar = () => {
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }

    const route = useRouter()

    const handleRoutePage = (link) => {
        route.push(link)
    }

    return (
        <>


            <div>
                <div className=" mt-3">

                    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-md">
                        <div className="container-fluid p-2 header">

                            <div className="btn btn-primary iconOuter" onClick={ToggleSidebar}  >
                                <i className="fa-solid fa-bars"></i>

                            </div>

                            <a className="navbar-brand-user text-primary mr-0">
                                <button className="btn btn-primary login-btn" type="submit" onClick={() => {
                                    route.push('/main')
                                }}>Home</button>

                            </a>


                        </div>
                    </nav>
                    <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
                        <div className="sd-header">
                            <h4 className="mb-0">Master</h4>
                            <div className="btn btn-primary iconOuter" onClick={ToggleSidebar}><i className="fa-solid fa-right-to-bracket fa-rotate-180"></i></div>
                        </div>
                        <div className="sd-body">
                            <ul>
                                {/* <DropLi
                                    nav='NavItem 1'
                                    navItems={[
                                        "Item 1",
                                        "item 2",
                                        "item 3"
                                    ]}
                                /> */}
                                <li className="sd-link" onClick={() => handleRoutePage('/main')}>Main Category List</li>
                                <li className="sd-link" onClick={() => handleRoutePage('/blog/')}>Blog List</li>

                            </ul>
                        </div>
                    </div>
                    <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
                </div>
                {children}

            </div>
            <ContextMenu />
        </>
    );
}

export default Siderbar;



const DropLi = ({ nav, navItems }) => {

    const [isNavOpen, setIsNavOpen] = useState(false)

    return (
        <>

            <li onClick={() => setIsNavOpen(!isNavOpen)} className="sd-link">{nav}
                {isNavOpen ? <i className="fa-solid fa-sort-up"></i> : <i className="fa-solid fa-sort-down"></i>}
            </li>
            {
                isNavOpen && navItems.length > 0 && navItems.map((item, i) => {
                    return (
                        <div key={i} className="navbarLi">

                            <li className="sd-link" style={{ paddingLeft: '30px' }}>{item}</li>
                        </div>
                    )
                })
            }


        </>
    )
}


const ContextMenu = () => {

    const [isMenuOpened, setIsMenuOpened] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpened(!isMenuOpened);
    };

    const route = useRouter()

    const handleRoutePage = (link) => {
        route.push(link)
    }
    // Close the menu when a click occurs outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpened && !event.target.closest(".menuOuter")) {
                setIsMenuOpened(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isMenuOpened]);

    return (
        <>
            <div className="menuOuter">
                <div className="more-menu" onClick={toggleMenu} style={isMenuOpened ? { transform: 'rotate(45deg)' } : []}>
                    {<i className="fa-solid fa-circle-plus"></i>}
                </div>

                {isMenuOpened && <nav className="more-options">
                    <section>
                        <li onClick={() => handleRoutePage('/category/new-main-category')}>Create a New Main Category</li>

                        <li onClick={() => handleRoutePage('/blog/new-blog')}>Create New Blog</li>

                    </section>

                </nav>
                }



            </div >
        </>
    );
};

