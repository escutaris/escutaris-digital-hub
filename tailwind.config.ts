
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Paleta v2 (jun/2026) — guia de marca Escutaris
				'escutaris-verde': '#222D19',        // Poseidon: texto principal e fundos pesados
				'escutaris-verde-marca': '#46603A',  // autoridade e blocos de conteúdo
				'escutaris-musgo': '#565E48',        // Hermes: transição, respiro, overlay
				'escutaris-oliva': '#757050',        // Athena: texto secundário, linhas
				'escutaris-terracota': '#B95839',    // assinatura e CTA (mantida)
				'escutaris-ambar': '#C98A42',        // Zeus: destaque suave
				'escutaris-cobre': '#A95821',        // Hades: transição quente
				'escutaris-ares': '#823112',         // terracota profunda, ênfase madura
				'escutaris-brasa': '#BE3A1B',        // Ember: dado crítico
				'escutaris-offwhite': '#F8F7F4',     // fundo geral dominante
				'escutaris-areia': '#F6F0E9',        // superfície quente
				'escutaris-oat': '#F0F0E8',          // superfície com sopro de verde
				'escutaris-cinza': '#E4DFD9',        // Epic Gray: respiro
				// aliases para compatibilidade com código existente
				escutaris: {
					green: {
						light: '#F0F0E8',
						DEFAULT: '#46603A',
						dark: '#222D19'
					},
					terracotta: {
						light: '#F6F0E9',
						DEFAULT: '#B95839',
						dark: '#823112'
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				'slide-in': {
					'0%': {
						transform: 'translateY(20px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'pulse-light': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out forwards',
				'slide-in': 'slide-in 0.8s ease-out forwards',
				'pulse-light': 'pulse-light 2s ease-in-out infinite'
			},
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				// identidade Escutaris: títulos em Garet, corpo em Poppins
				// (token mantém o nome 'cormorant' para não tocar nos componentes)
				'cormorant': ['Garet', 'Poppins', 'sans-serif'],
				'garet': ['Garet', 'Poppins', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
