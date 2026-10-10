"use client";

import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import React, { useState } from "react";

const Home = () => {
  const [expand, setExpand] = useState(false);
  const [message, setMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // console.log(expand);

  return (
    <>
      <div className="flex h-screen ">
        {/* sidebar */}
        <Sidebar expand={expand} setExpand={setExpand} />

        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <Image
              onClick={() => (expand ? setExpand(false) : setExpand(true))}
              className="rotate-180"
              src={assets.menu_icon}
              alt="menu-icon"
            />

            <Image
              className="opacity-70"
              src={assets.chat_icon}
              alt="chat-icon"
            />
          </div>

          {message.length === 0 ? (
            <>
              <div className="flex items-center gap-3">
                <Image
                  src={assets.logo_icon}
                  alt="logo-icon"
                  className="h-16 w-8"
                />
                <p>Hi, I&apos;m DeepSeek</p>
              </div>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>
          ) : (
            <div>
              <Message role="user" content="what is next js" />
            </div>
          )}

          {/* prompt box */}
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />

          <p className="text-xs absolute bottom-1 text-gray-500">
            Ai-generated, for reference only
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
