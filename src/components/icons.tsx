import React from 'react';

type IconName =
  | 'dashboard' | 'datasets' | 'models' | 'analysis' | 'deepdive' | 'audit'
  | 'alerts' | 'settings' | 'bell' | 'play' | 'upload' | 'folder'
  | 'chevron-right' | 'arrow-right' | 'arrow-up' | 'arrow-down'
  | 'alert-triangle' | 'shield' | 'shield-check' | 'info' | 'check' | 'x'
  | 'sparkles' | 'plus' | 'filter' | 'download' | 'eye' | 'eye-off'
  | 'clock' | 'cube' | 'database' | 'trending' | 'logout' | 'flag'
  | 'more-h' | 'mail' | 'user-plus' | 'users' | 'briefcase' | 'lock'
  | 'chevron-down' | 'trash' | 'chevron-left' | 'menu' | 'eclipse';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const Icon = ({ name, size = 16, className = '', strokeWidth = 1.75 }: IconProps) => {
  const p = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const v = { width: size, height: size, viewBox: '0 0 24 24', className };
  switch (name) {
    case 'dashboard': return (
      <svg {...v}><rect x="3" y="3" width="7" height="9" rx="1.5" {...p}/><rect x="14" y="3" width="7" height="5" rx="1.5" {...p}/><rect x="14" y="12" width="7" height="9" rx="1.5" {...p}/><rect x="3" y="16" width="7" height="5" rx="1.5" {...p}/></svg>
    );
    case 'datasets': return (
      <svg {...v}><ellipse cx="12" cy="5" rx="8" ry="3" {...p}/><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" {...p}/><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" {...p}/></svg>
    );
    case 'models': return (
      <svg {...v}><circle cx="6" cy="6" r="2.2" {...p}/><circle cx="18" cy="6" r="2.2" {...p}/><circle cx="12" cy="12" r="2.2" {...p}/><circle cx="6" cy="18" r="2.2" {...p}/><circle cx="18" cy="18" r="2.2" {...p}/><path d="M7.6 7.4 10.4 10.6M13.6 10.6 16.4 7.4M10.4 13.4 7.6 16.6M13.6 13.4 16.4 16.6" {...p}/></svg>
    );
    case 'analysis': return (
      <svg {...v}><path d="M3 3v17a1 1 0 0 0 1 1h17" {...p}/><path d="m7 16 4-5 4 3 5-6" {...p}/></svg>
    );
    case 'deepdive': return (
      <svg {...v}><circle cx="11" cy="11" r="7" {...p}/><path d="m20 20-3.5-3.5" {...p}/><path d="M8 11h6M11 8v6" {...p}/></svg>
    );
    case 'audit': return (
      <svg {...v}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" {...p}/><path d="M14 3v6h6" {...p}/><path d="m8 14 2.5 2.5L16 11" {...p}/></svg>
    );
    case 'alerts': return (
      <svg {...v}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...p}/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" {...p}/></svg>
    );
    case 'settings': return (
      <svg {...v}><circle cx="12" cy="12" r="3" {...p}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" {...p}/></svg>
    );
    case 'bell': return (
      <svg {...v}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...p}/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" {...p}/></svg>
    );
    case 'play': return (
      <svg {...v}><polygon points="6 4 20 12 6 20 6 4" {...p}/></svg>
    );
    case 'upload': return (
      <svg {...v}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...p}/><polyline points="17 8 12 3 7 8" {...p}/><line x1="12" y1="3" x2="12" y2="15" {...p}/></svg>
    );
    case 'folder': return (
      <svg {...v}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" {...p}/></svg>
    );
    case 'chevron-right': return (
      <svg {...v}><polyline points="9 6 15 12 9 18" {...p}/></svg>
    );
    case 'arrow-right': return (
      <svg {...v}><line x1="5" y1="12" x2="19" y2="12" {...p}/><polyline points="12 5 19 12 12 19" {...p}/></svg>
    );
    case 'arrow-up': return (
      <svg {...v}><line x1="12" y1="19" x2="12" y2="5" {...p}/><polyline points="5 12 12 5 19 12" {...p}/></svg>
    );
    case 'arrow-down': return (
      <svg {...v}><line x1="12" y1="5" x2="12" y2="19" {...p}/><polyline points="19 12 12 19 5 12" {...p}/></svg>
    );
    case 'alert-triangle': return (
      <svg {...v}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" {...p}/><line x1="12" y1="9" x2="12" y2="13" {...p}/><line x1="12" y1="17" x2="12.01" y2="17" {...p}/></svg>
    );
    case 'shield': return (
      <svg {...v}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p}/></svg>
    );
    case 'shield-check': return (
      <svg {...v}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p}/><path d="m9 12 2 2 4-4" {...p}/></svg>
    );
    case 'info': return (
      <svg {...v}><circle cx="12" cy="12" r="9" {...p}/><line x1="12" y1="16" x2="12" y2="12" {...p}/><line x1="12" y1="8" x2="12.01" y2="8" {...p}/></svg>
    );
    case 'check': return (
      <svg {...v}><polyline points="20 6 9 17 4 12" {...p}/></svg>
    );
    case 'x': return (
      <svg {...v}><line x1="18" y1="6" x2="6" y2="18" {...p}/><line x1="6" y1="6" x2="18" y2="18" {...p}/></svg>
    );
    case 'sparkles': return (
      <svg {...v}><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" {...p}/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" {...p}/></svg>
    );
    case 'plus': return (
      <svg {...v}><line x1="12" y1="5" x2="12" y2="19" {...p}/><line x1="5" y1="12" x2="19" y2="12" {...p}/></svg>
    );
    case 'filter': return (
      <svg {...v}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" {...p}/></svg>
    );
    case 'download': return (
      <svg {...v}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...p}/><polyline points="7 10 12 15 17 10" {...p}/><line x1="12" y1="15" x2="12" y2="3" {...p}/></svg>
    );
    case 'eye': return (
      <svg {...v}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></svg>
    );
    case 'eye-off': return (
      <svg {...v}><path d="M17.94 17.94A10.5 10.5 0 0 1 12 19c-7 0-10-7-10-7a18.6 18.6 0 0 1 5.06-5.94" {...p}/><path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 10 7 10 7a18.7 18.7 0 0 1-2.16 3.19" {...p}/><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" {...p}/><line x1="3" y1="3" x2="21" y2="21" {...p}/></svg>
    );
    case 'clock': return (
      <svg {...v}><circle cx="12" cy="12" r="9" {...p}/><polyline points="12 7 12 12 15 14" {...p}/></svg>
    );
    case 'cube': return (
      <svg {...v}><path d="m21 16-9 5-9-5V8l9-5 9 5z" {...p}/><path d="m3.3 7.5 8.7 5 8.7-5M12 22V12.5" {...p}/></svg>
    );
    case 'database': return (
      <svg {...v}><ellipse cx="12" cy="5" rx="8" ry="3" {...p}/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" {...p}/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" {...p}/></svg>
    );
    case 'trending': return (
      <svg {...v}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" {...p}/><polyline points="16 7 22 7 22 13" {...p}/></svg>
    );
    case 'logout': return (
      <svg {...v}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" {...p}/><polyline points="16 17 21 12 16 7" {...p}/><line x1="21" y1="12" x2="9" y2="12" {...p}/></svg>
    );
    case 'flag': return (
      <svg {...v}><path d="M4 21V4a1 1 0 0 1 1-1h13l-2 5 2 5H5" {...p}/></svg>
    );
    case 'more-h': return (
      <svg {...v}><circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>
    );
    case 'mail': return (
      <svg {...v}><rect x="3" y="5" width="18" height="14" rx="2" {...p}/><path d="m3 7 9 6 9-6" {...p}/></svg>
    );
    case 'user-plus': return (
      <svg {...v}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...p}/><circle cx="9" cy="7" r="4" {...p}/><line x1="19" y1="8" x2="19" y2="14" {...p}/><line x1="22" y1="11" x2="16" y2="11" {...p}/></svg>
    );
    case 'users': return (
      <svg {...v}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...p}/><circle cx="9" cy="7" r="4" {...p}/><path d="M23 21v-2a4 4 0 0 0-3-3.87" {...p}/><path d="M16 3.13a4 4 0 0 1 0 7.75" {...p}/></svg>
    );
    case 'briefcase': return (
      <svg {...v}><rect x="2" y="7" width="20" height="14" rx="2" {...p}/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...p}/></svg>
    );
    case 'lock': return (
      <svg {...v}><rect x="4" y="11" width="16" height="10" rx="2" {...p}/><path d="M8 11V7a4 4 0 0 1 8 0v4" {...p}/></svg>
    );
    case 'chevron-down': return (
      <svg {...v}><polyline points="6 9 12 15 18 9" {...p}/></svg>
    );
    case 'trash': return (
      <svg {...v}><polyline points="3 6 5 6 21 6" {...p}/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...p}/></svg>
    );
    case 'chevron-left': return (
      <svg {...v}><polyline points="15 6 9 12 15 18" {...p}/></svg>
    );
    case 'menu': return (
      <svg {...v}><line x1="3" y1="6" x2="21" y2="6" {...p}/><line x1="3" y1="12" x2="21" y2="12" {...p}/><line x1="3" y1="18" x2="21" y2="18" {...p}/></svg>
    );
    case 'eclipse': return (
      <svg {...v}>
        <circle cx="9" cy="12" r="7" {...p}/>
        <circle cx="15" cy="12" r="7" {...p}/>
      </svg>
    );
    default: return <svg {...v}/>;
  }
};

export { Icon };
