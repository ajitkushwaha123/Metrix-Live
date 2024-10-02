import React from 'react'
import { NavLink } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <div>
      <section className="bg-[#f8f8ff] dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-5xl pb-[40px] tracking-tight font-extrabold lg:text-[100px] text-primary dark:text-primary-500">
                Coming Soon
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                Something cool is cooking ...!
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                We are working on something amazing. Stay tuned!
            </p>
            <NavLink
              to={"/"}
              className="inline-flex text-white bg-primary hover:bg-white hover:text-primary hover:border-2 hover:border-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
            >
              Back to Homepage
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ComingSoon
