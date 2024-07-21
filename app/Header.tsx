"use client";
import React, { useState } from "react";
import HotTubIcon from '@mui/icons-material/HotTub';
import HamburgerMenu from '@/components/HamburgerMenu';
import Drawer from '@mui/material/Drawer';

const Header = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);

  const handleDrawerToggle = (open: boolean) => {
    setDrawerOpened(open);
  };

  return (
    <header className="bg-gray-800 text-white p-2 flex items-center justify-between">
      <img 
        src="https://img.icons8.com/?size=100&id=36389&format=png&color=FFFFFF" 
        onClick={() => handleDrawerToggle(true)}
        className="text-white focus:outline-none md:hidden h-10 w-10"
      />
      <Drawer
        anchor={'left'}
        open={drawerOpened}
        onClose={() => handleDrawerToggle(false)}
      >
        <div
          onClick={() => handleDrawerToggle(false)}
          onKeyDown={() => handleDrawerToggle(false)}
          role="presentation"
        >
          <HamburgerMenu />
        </div>
      </Drawer>
      <div className="flex items-center justify-center flex-grow p-2">
        <a href="/">
          <HotTubIcon style={{ fontSize: 40 }} />
        </a>
        <h1 className="text-xl font-bold ml-2">Campus Sauna Lab</h1>
      </div>
    </header>
  );
};

export default Header;
