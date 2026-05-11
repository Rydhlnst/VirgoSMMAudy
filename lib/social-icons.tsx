import type { ComponentType } from "react";
import type { IconBaseProps } from "react-icons";
import { FaInstagram, FaFacebook, FaLink, FaTiktok } from "react-icons/fa6";

export type SocialPlatform = string;

const PLATFORM_ICON: Record<string, ComponentType<IconBaseProps>> = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  "tik tok": FaTiktok,
  facebook: FaFacebook,
};

export function getSocialIcon(platform: SocialPlatform): ComponentType<IconBaseProps> {
  const key = platform.trim().toLowerCase();
  return PLATFORM_ICON[key] ?? FaLink;
}

