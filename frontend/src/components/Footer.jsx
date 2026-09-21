import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Instagram } from "lucide-react";
import contactConfig from "../config/contact";
import { services } from "../config/services";

export const Footer = () => {
  return (
    <footer
      className="bg-[#0F0F0F] border-t border-[#2A2A2A] py-12 text-[#666] mt-auto"
      id="footer_container"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand / About */}
          <div>
            <div className="flex items-center mb-5 group select-none" id="footer_brand_logo_container">
              <div className="flex items-center space-x-1.5" id="footer_segmented_brand_badge">
                <div className="px-2.5 py-1 bg-[#141414]/80 border border-[#2A2A2A] rounded-lg flex flex-col justify-center items-center text-center shadow-md transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:bg-[#D4AF37]/5">
                  <span className="font-serif italic text-xs font-medium text-[#F5F5F5] tracking-wide leading-tight">
                    ENDLESS Moments
                  </span>
                  <span className="text-[#D4AF37] text-[7px] font-bold uppercase tracking-widest font-mono leading-none mt-0.5">
                    Photography
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Capture your moments with refined wedding photography, pre-weddings,
              cinematic videos, and customized portrait sessions.
            </p>
          </div>

          {/* Creative Works */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#F5F5F5] mb-4 font-mono">
              Creative Works
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/projects?category=${service.slug}`}
                    className="hover:text-[#D4AF37] transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#F5F5F5] mb-4 font-mono">
              Contact Details
            </h4>
            <ul className="space-y-3 text-xs text-gray-500">
              {contactConfig.instagramLinks.length > 0 && (
                <li className="flex items-start space-x-2">
                  <Instagram className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    {contactConfig.instagramLinks.map((link, index) => {
                      const profileName = link.replace(/\/+$/, "").split("/").pop();
                      return (
                        <a
                          key={index}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#D4AF37] transition-colors"
                        >
                          @{profileName}
                        </a>
                      );
                    })}
                  </div>
                </li>
              )}

              {contactConfig.phones.length > 0 && (
                <li className="flex items-start space-x-2">
                  <Phone className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    {contactConfig.phones.map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="hover:text-[#D4AF37] transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </li>
              )}

              {contactConfig.emails.length > 0 && (
                <li className="flex items-start space-x-2">
                  <Mail className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    {contactConfig.emails.map((email, index) => (
                      <a
                        key={index}
                        href={`mailto:${email}`}
                        className="break-all hover:text-[#D4AF37] transition-colors"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600">
          <p>© {new Date().getFullYear()} ENDLESS Moments. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono tracking-widest text-[#666] text-[10px] uppercase">
            Capture your moments • ENDLESS Moments
          </p>
        </div>
      </div>
    </footer>
  );
};
