import React from "react";
import { withRouter } from "react-router-dom";

import Alt401 from '../AuthenticationInner/Errors/Alt401';

const NoAccessPermission = () => {
    return (
        <>
            <Alt401 />
        </>
    );
}
export default withRouter(NoAccessPermission);