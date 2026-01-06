
import { useRouter } from 'next/navigation'
import { Menu, Button, MenuProps,  } from 'antd'
import {
    AppstoreOutlined,
    ContainerOutlined,
    DesktopOutlined,
    MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { useState } from 'react';


type MenuItem = Required<MenuProps>['items'][number];


export function SideBar() {
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter()
    
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

        
    const items: MenuItem[] = [
        { key: '1', icon: <PieChartOutlined />, label: 'QR Download', onClick: () => router.push("/operator") },
        { key: '2', icon: <DesktopOutlined />, label: 'Uploads' , onClick: () => router.push("/admin") },
        { key: '3', icon: <ContainerOutlined />, label: 'Challan' , onClick: () => router.push("/challan/book") },
    ];    
    
    return <>
        <div className={`p-4 pr-0 min-w-max flex flex-col border items-start`}>
            <Button type="primary" className="ml-1" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
            <Menu
                mode="inline"
                theme="light" 
                items={items}
                inlineIndent={55}
                defaultOpenKeys={['sub1']}
                triggerSubMenuAction="hover"
                defaultSelectedKeys={['1']}
                inlineCollapsed={collapsed}
            />
        </div>
    </>
}

