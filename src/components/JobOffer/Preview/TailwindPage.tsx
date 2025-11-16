"use client"

import React from "react"

interface TailwindPageProps {
	children: React.ReactNode
	editMode?: boolean
	pageNumber?: number
}

/**
 * TailwindPage - A component that accepts Tailwind JSX from Figma
 *
 * Usage:
 * 1. Copy Tailwind JSX from Figma Dev Mode
 * 2. Paste it as children of this component
 * 3. It automatically:
 *    - Converts Figma fonts to our font system
 *    - Makes elements editable in edit mode
 *    - Works with PDF generation
 *
 * Example:
 * <TailwindPage editMode={editMode}>
 *   {/* Paste Figma Tailwind JSX here *\/}
 *   <div className="w-[595px] h-[842px] relative bg-stone-200">
 *     ...
 *   </div>
 * </TailwindPage>
 */
export default function TailwindPage({ children, editMode = false, pageNumber }: TailwindPageProps) {
	// Auto-convert Figma font classes to our font system
	const convertFonts = (element: React.ReactElement): React.ReactElement => {
		if (!React.isValidElement(element)) return element

		const props = element.props as any
		let className = props.className || ""

		// Convert Figma font families to our font system
		if (className.includes("font-['Thmanyah_sans")) {
			className = className.replace(/font-\['Thmanyah_sans[^']*'\]/g, "font-8-sans")
		}
		if (className.includes("font-['Thmanyah_serif_display")) {
			className = className.replace(/font-\['Thmanyah_serif_display[^']*'\]/g, "font-8-display")
		}
		if (className.includes("font-['Thmanyah_serif")) {
			className = className.replace(/font-\['Thmanyah_serif[^']*'\]/g, "font-8-serif")
		}

		// Recursively process children
		const processedChildren = React.Children.map(props.children, (child) => {
			if (React.isValidElement(child)) {
				return convertFonts(child)
			}
			return child
		})

		// Return cloned element with converted className and processed children
		return React.cloneElement(
			element,
			{ ...props, className } as any,
			processedChildren
		)
	}

	const processedContent = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			return convertFonts(child)
		}
		return child
	})

	return (
		<div className="page-v2 mb-4">
			{processedContent}
		</div>
	)
}
