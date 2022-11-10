import { Outlet } from "react-router-dom";

const ActivityPage = () => {
    return (
        <>
            <header>Activité</header>
            <Outlet />
        </>
    );
};

export default ActivityPage;
