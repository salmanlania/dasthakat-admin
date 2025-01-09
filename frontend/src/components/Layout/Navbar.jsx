import { Button } from 'antd';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../store/features/sidebarSlice';
import ProfileMenu from '../Menu/ProfileMenu';

import LOGO from '../../assets/logo.jpg';

const Navbar = () => {
  const { isCollapsed } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  return (
    <nav className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-primary px-4 text-white">
      <div className="flex items-center gap-4">
        <Button
          icon={
            <IoIosArrowBack
              size={16}
              className={`${isCollapsed ? 'rotate-180' : ''} transition-all`}
            />
          }
          type="primary"
          className="!border-gray-200"
          size="small"
          onClick={() => dispatch(toggleSidebar())}
        />
        <div className="flex items-center gap-2">
          <img src={LOGO} alt="logo" className="h-8 rounded-sm object-contain" />
          <span className="overflow-hidden text-ellipsis text-nowrap">
            Global Marine Safety - America
          </span>
        </div>
      </div>

      <ProfileMenu />
    </nav>
  );
};
export default Navbar;
