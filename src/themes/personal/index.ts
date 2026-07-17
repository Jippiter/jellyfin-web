import { buildCustomColorScheme } from 'themes/utils';

/**
 * The "Personal" color scheme — a streaming-service-style redesign.
 * Design tokens sourced from the redesign handoff (see jellyfin-redesign/mockup).
 * OKLCH accents from the handoff are converted to sRGB hex here because MUI's
 * JS palette color parser does not understand oklch(); the raw oklch values are
 * still available as CSS custom properties in theme.scss.
 */
const theme = buildCustomColorScheme({
    palette: {
        mode: 'dark',
        background: {
            // Base page background
            default: '#0e0e14',
            // Surfaces / cards / menus
            paper: '#16161f'
        },
        primary: {
            // Accent — oklch(0.65 0.19 260) indigo-blue
            main: '#438aff'
        },
        secondary: {
            // Magenta accent preset — oklch(0.65 0.19 320)
            main: '#c061d6'
        },
        text: {
            primary: '#e8e8ee',
            secondary: '#b8b8c4'
        },
        starIcon: {
            // Rating green from the handoff
            main: '#7ee0a3'
        },
        error: {
            // Favourite/heart active — oklch(0.68 0.19 15)
            main: '#f65b72'
        },
        AppBar: {
            // Nav bar fades to the page background
            defaultBg: '#0e0e14'
        }
    }
});

export default theme;
