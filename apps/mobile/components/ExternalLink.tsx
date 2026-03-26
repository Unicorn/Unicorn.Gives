import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import type { ComponentProps } from 'react';
import { Platform } from 'react-native';

type LinkProps = ComponentProps<typeof Link>;

export function ExternalLink(
  props: Omit<LinkProps, 'href'> & { href: LinkProps['href'] }
) {
  const { href, ...rest } = props;

  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          e.preventDefault();
          if (typeof href === 'string') {
            WebBrowser.openBrowserAsync(href);
          }
        }
      }}
    />
  );
}
