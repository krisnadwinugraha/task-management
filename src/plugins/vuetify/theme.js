// Primary brand colors - Using electric violet with gradient potential
export const staticPrimaryColor = '#8B5CF6' // Electric violet
export const staticPrimaryDarkenColor = '#7C3AED'

// Gradient definitions for components that support them
export const gradients = {
  primary: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
  secondary: 'linear-gradient(135deg, #F472B6 0%, #EC4899 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  warning: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
  error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  info: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)'
}

export const themes = {
  light: {
    dark: false,
    colors: {
      'primary': staticPrimaryColor,
      'on-primary': '#fff',
      'primary-darken-1': staticPrimaryDarkenColor,
      'secondary': '#F472B6', // Vibrant pink for amazing contrast
      'secondary-darken-1': '#EC4899',
      'on-secondary': '#fff',
      'success': '#10B981', // Emerald
      'success-darken-1': '#059669',
      'on-success': '#fff',
      'info': '#0EA5E9', // Vivid blue
      'info-darken-1': '#0284C7',
      'on-info': '#fff',
      'warning': '#FBBF24', // Bright amber
      'warning-darken-1': '#F59E0B',
      'on-warning': '#18181B',
      'error': '#EF4444', // Vivid red
      'error-darken-1': '#DC2626',
      'on-error': '#fff',
      'background': '#FAFAFA', // Clean, bright background
      'on-background': '#18181B',
      'surface': '#ffffff',
      'on-surface': '#18181B',
      
      // Modern gray scale with slight purple tint
      'grey-50': '#F9FAFB',
      'grey-100': '#F3F4F6',
      'grey-200': '#E5E7EB',
      'grey-300': '#D1D5DB',
      'grey-400': '#9CA3AF',
      'grey-500': '#6B7280',
      'grey-600': '#4B5563',
      'grey-700': '#374151',
      'grey-800': '#1F2937',
      'grey-900': '#111827',
      
      // Special surfaces
      'perfect-scrollbar-thumb': '#8B5CF6',
      'skin-bordered-background': '#ffffff',
      'skin-bordered-surface': '#ffffff',
      'expansion-panel-text-custom-bg': '#F3F4F6',
      'track-bg': '#F3F4F6',
      'chat-bg': '#F9FAFB',
      
      // Custom colors for special elements
      'card-shadow': 'rgba(139, 92, 246, 0.05)',
      'border-subtle': '#E5E7EB',
      'hover-highlight': '#F5F3FF'
    },
    variables: {
      'code-color': '#8B5CF6',
      'overlay-scrim-background': '#18181B',
      'tooltip-background': '#1F2937',
      'overlay-scrim-opacity': 0.5,
      
      // Refined interaction states
      'hover-opacity': 0.05,
      'focus-opacity': 0.12,
      'selected-opacity': 0.08,
      'activated-opacity': 0.12,
      'pressed-opacity': 0.16,
      'dragged-opacity': 0.08,
      'disabled-opacity': 0.38,
      
      'border-color': '#E5E7EB',
      'border-opacity': 0.12,
      'table-header-color': '#F9FAFB',
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.65,
      
      // Enhanced shadow system
      'shadow-key-umbra-color': 'rgba(139, 92, 246, 0.06)',
      'shadow-xs-opacity': '0.04',
      'shadow-sm-opacity': '0.06',
      'shadow-md-opacity': '0.08',
      'shadow-lg-opacity': '0.10',
      'shadow-xl-opacity': '0.12',
    },
  },
  dark: {
    dark: true,
    colors: {
      'primary': '#A78BFA', // Lighter violet for dark mode
      'on-primary': '#18181B',
      'primary-darken-1': '#8B5CF6',
      'secondary': '#F9A8D4', // Lighter pink for dark mode
      'secondary-darken-1': '#F472B6',
      'on-secondary': '#18181B',
      'success': '#34D399',
      'success-darken-1': '#10B981',
      'on-success': '#18181B',
      'info': '#38BDF8',
      'info-darken-1': '#0EA5E9',
      'on-info': '#18181B',
      'warning': '#FCD34D',
      'warning-darken-1': '#FBBF24',
      'on-warning': '#18181B',
      'error': '#FCA5A5',
      'error-darken-1': '#EF4444',
      'on-error': '#18181B',
      
      // Rich dark mode background
      'background': '#0F172A', // Deep blue-gray
      'on-background': '#F9FAFB',
      'surface': '#1E293B',
      'on-surface': '#F9FAFB',
      
      // Dark mode optimized grays
      'grey-50': '#1E293B',
      'grey-100': '#293548',
      'grey-200': '#334155',
      'grey-300': '#475569',
      'grey-400': '#64748B',
      'grey-500': '#94A3B8',
      'grey-600': '#CBD5E1',
      'grey-700': '#E2E8F0',
      'grey-800': '#F1F5F9',
      'grey-900': '#F8FAFC',
      
      // Special surfaces for dark mode
      'perfect-scrollbar-thumb': '#A78BFA',
      'skin-bordered-background': '#1E293B',
      'skin-bordered-surface': '#1E293B',
      'expansion-panel-text-custom-bg': '#293548',
      'track-bg': '#293548',
      'chat-bg': '#1E293B',
      
      // Custom colors for special elements in dark mode
      'card-shadow': 'rgba(167, 139, 250, 0.05)',
      'border-subtle': '#334155',
      'hover-highlight': '#2E1065'
    },
    variables: {
      'code-color': '#A78BFA',
      'overlay-scrim-background': '#0F172A',
      'tooltip-background': '#F8FAFC',
      'overlay-scrim-opacity': 0.7,
      
      // Dark mode optimized interaction states
      'hover-opacity': 0.07,
      'focus-opacity': 0.14,
      'selected-opacity': 0.10,
      'activated-opacity': 0.14,
      'pressed-opacity': 0.18,
      'disabled-opacity': 0.38,
      'dragged-opacity': 0.10,
      
      'border-color': '#F8FAFC',
      'border-opacity': 0.12,
      'table-header-color': '#293548',
      'high-emphasis-opacity': 0.87,
      'medium-emphasis-opacity': 0.65,
      
      // Enhanced shadow system for dark mode
      'shadow-key-umbra-color': '#000000',
      'shadow-xs-opacity': '0.20',
      'shadow-sm-opacity': '0.24',
      'shadow-md-opacity': '0.28',
      'shadow-lg-opacity': '0.32',
      'shadow-xl-opacity': '0.36',
    },
  },
}

export default themes
