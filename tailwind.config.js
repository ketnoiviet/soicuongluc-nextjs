/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			/* ===== Admin "glass" design system (chỉ dùng trong .admin-root) ===== */
  			'admin-primary': 'rgb(var(--admin-primary) / <alpha-value>)',
  			'admin-primary-2': 'rgb(var(--admin-primary-2) / <alpha-value>)',
  			'admin-sky': 'rgb(var(--admin-sky) / <alpha-value>)',
  			'admin-amber': 'rgb(var(--admin-amber) / <alpha-value>)',
  			'admin-rose': 'rgb(var(--admin-rose) / <alpha-value>)',
  			'admin-emerald': 'rgb(var(--admin-emerald) / <alpha-value>)',
  			'admin-text': 'rgb(var(--admin-text) / <alpha-value>)',
  			'admin-text-2': 'rgb(var(--admin-text-2) / <alpha-value>)',
  			'admin-text-3': 'rgb(var(--admin-text-3) / <alpha-value>)',
  			'admin-border': 'rgb(var(--admin-border) / <alpha-value>)',
  			'admin-bg': 'rgb(var(--admin-bg) / <alpha-value>)',
  			'admin-card': 'rgb(var(--admin-card) / <alpha-value>)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'admin-lg': '22px',
  			'admin-md': '12px',
  			'admin-sm': '10px'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
