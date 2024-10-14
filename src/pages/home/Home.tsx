import { EdtRoutesNameEnum } from "../../enumerations/EdtRoutesNameEnum";
import { EdtUserRightsEnum } from "../../enumerations/EdtUserRightsEnum";
import { Navigate } from "react-router-dom";
import { getNavigatePath } from "../../service/navigation-service";
import { useAuth } from "../../hooks/useAuth.ts";

const HomePage = () => {
    const { role } = useAuth();

    if (role === EdtUserRightsEnum.REVIEWER) {
        return <Navigate to={getNavigatePath(EdtRoutesNameEnum.REVIEWER_HOME)} />;
    }
    return <Navigate to={getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME)} />;
};
export default HomePage;
