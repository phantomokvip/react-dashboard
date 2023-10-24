import React from "react";
import {  Spin  } from "antd";
import PropTypes from "prop-types";

const LoadingPage = ({loading}) => {
  
  return (
    <>
        {loading ?
            <div className="loading_page" >
                <Spin />
            </div> :
            <></>
        }     
    </>
  );
};

LoadingPage.propTypes = {
    loading: PropTypes.any,
};

export default LoadingPage;
