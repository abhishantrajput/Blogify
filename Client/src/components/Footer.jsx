import React from "react";
import { Link } from "react-router-dom";
import {BsFacebook, BsInstagram, BsLinkedin, BsGithub} from "react-icons/bs"

import { Footer } from "flowbite-react";

const FooterCom = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="max-w-7xl w-full mx-auto ">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div>
            <Link
              to={"/"}
              className="self-center text-lg sm:text-xl font-semibold dark:white "
            >
              <span className="px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Blogify
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://science.com" target="_blank">
                  Science
                </Footer.Link>
                <Footer.Link href="https://education.com" target="_blank">
                  Education
                </Footer.Link>
                <Footer.Link href="https://space.com" target="_blank">
                  Space
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://instagram.com" target="_blank">
                  Instagram
                </Footer.Link>
                <Footer.Link href="https://github.com" target="_blank">
                  Github
                </Footer.Link>
                <Footer.Link href="https://discord.com" target="_blank">
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="mt-5 sm:mt-0">
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>

                <Footer.Link href="#" target="_blank">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#" target="_blank">
                  Term &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider/>
        <div className="mt-3 mb-3 sm:mt-0 sm:mb-0">
          <Footer.Copyright href="#" by="by Abhishant Rajput" year={new Date().getFullYear()}/>
        </div>
        <div className="flex gap-4">
          <Footer.Icon href="" icon={BsFacebook} />
          <Footer.Icon href="" icon={BsInstagram} />
          <Footer.Icon href="" icon={BsLinkedin} />
          <Footer.Icon href="" icon={BsGithub} />
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
