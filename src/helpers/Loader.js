import Image from 'next/image';
import React from 'react';
import loader from '../images/loader.gif'

const Loader = () => {
    return (
        <div className='loader-outer'>

            <div className='loader-img'>
                <Image src={loader} />
            </div>

        </div>
    );
}

export default Loader;



export const Loader1 = () => {
    return (
        <>
            <div className='loader-outer'>


                <div className="loading-container">
                    <div className="loading-text">
                        <span>L</span>
                        <span>O</span>
                        <span>A</span>
                        <span>D</span>
                        <span>I</span>
                        <span>N</span>
                        <span>G</span>
                    </div>
                </div>
            </div>
        </>
    )
}