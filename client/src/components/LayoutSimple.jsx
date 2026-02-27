import { Outlet } from 'react-router-dom';

const LayoutSimple = () => {
    return (
        <div>
            <h1>Debugging Layout</h1>
            <Outlet />
        </div>
    );
};

export default LayoutSimple;
