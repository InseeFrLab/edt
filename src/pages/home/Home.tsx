import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { EdtUserRightsEnum } from "enumerations/EdtUserRightsEnum";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import { getUserRights } from "service/user-service";

const HomePage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (getUserRights() === EdtUserRightsEnum.REVIEWER) {
            navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_HOME));
        } else {
            navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
        }
    }, []);
    return <></>;
};
export default HomePage;
