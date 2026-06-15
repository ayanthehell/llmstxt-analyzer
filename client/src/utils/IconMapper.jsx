import React from 'react';
import * as Icons from 'lucide-react';

/**
 * Maps a string icon name from the database to a corresponding lucide-react component.
 * If the icon is not found, a default fallback (e.g., CircleHelp) is returned.
 */
export const DynamicIcon = ({ name, className = "w-6 h-6", defaultIcon = "HelpCircle" }) => {
  let IconComponent = Icons[name];

  if (!IconComponent) {
    IconComponent = Icons[defaultIcon];
  }

  // If even the default is not found, return null
  if (!IconComponent) return null;

  return <IconComponent className={className} />;
};

export default DynamicIcon;
