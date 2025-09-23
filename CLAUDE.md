# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- Preview docs locally: `mint dev` (runs on http://localhost:3000)
- Install Mintlify CLI: `npm i -g mint`
- Update Mintlify CLI: `mint update`

## Architecture

### Project Structure

This is a Mintlify documentation site for WithSeismic - Internal Tools & Automation services:

- **docs.json**: Main configuration defining navigation tabs, theme colors (#FF8000 primary), and site settings
- **MDX files**: Content pages with YAML frontmatter for metadata
- **Custom styling**: custom.css for dark theme customization (rgb(8, 8, 8) background)
- **Analytics**: analytics.js for tracking implementation

### Content Organization

- **/approach**: Development process documentation (discovery, sprints, launch, optimization)
- **/articles**: Blog-style content and thought leadership pieces
- **/build**: Service offerings (MVPs, internal tools, LLM workflows, MCP servers, web extensions)
- **/case-studies**: Client project showcases organized by category
- **/interactive-tools**: Interactive demos and tools (social media mockup, glyphs)
- **/pre-built-tools**: Ready-to-use tool documentation
- **/services**: Service descriptions (no-code to production, productization)
- **/snippets**: Reusable MDX components (email capture, Cal.com embeds, calculators)
- **/tool-ideas**: Tool suggestions by team type and business model
- **/universities**: Educational content on automation and n8n

### Navigation Structure

Multiple tabs defined in docs.json:
- **Our Services**: Getting started, what we build, our approach
- **Case Studies**: Project examples by category (web extensions, automation, AI/LLM, MVP, browser automation)
- **Tool Ideas**: Organized by team type and business model
- **Pre-Built Tools**: Ready-to-deploy solutions
- **Universities**: Automation and n8n training content

### Theme Configuration

- Colors: Orange theme (#FF8000 primary, #FFA040 light, #CC6600 dark)
- Banner: Promotional CTA with dismissible option
- Favicon: /favicon.svg

## Documentation Standards

### MDX File Requirements

- **Required frontmatter**: title, description
- **Optional frontmatter**: icon (for visual navigation)
- All code blocks must include language tags
- Use relative paths for internal links
- Images stored in /images directory

### Content Guidelines

- Use second-person voice ("you")
- Document just enough for user success
- Prioritize accuracy and evergreen content
- Check existing patterns before adding new content
- Match style of existing pages
- Include prerequisites at start of procedures

### Component Usage

- Mintlify provides built-in components (Accordions, Cards, Tabs, etc.)
- Snippets can be imported using `<snippets/snippet-name.mdx>`
- API endpoints use OpenAPI specification in /api-reference/openapi.json

# Mintlify documentation

## Working relationship

- You can push back on ideas-this can lead to better documentation. Cite sources and explain your reasoning when you do so
- ALWAYS ask for clarification rather than making assumptions
- NEVER lie, guess, or make up information

## Project context

- Format: MDX files with YAML frontmatter
- Config: docs.json for navigation, theme, settings
- Components: Mintlify components

## Content strategy

- Document just enough for user success - not too much, not too little
- Prioritize accuracy and usability of information
- Make content evergreen when possible
- Search for existing information before adding new content. Avoid duplication unless it is done for a strategic reason
- Check existing patterns for consistency
- Start by making the smallest reasonable changes

## Frontmatter requirements for pages

- title: Clear, descriptive page title
- description: Concise summary for SEO/navigation

## Writing standards

- Second-person voice ("you")
- Prerequisites at start of procedural content
- Test all code examples before publishing
- Match style and formatting of existing pages
- Include both basic and advanced use cases
- Language tags on all code blocks
- Alt text on all images
- Relative paths for internal links

## Git workflow

- NEVER use --no-verify when committing
- Ask how to handle uncommitted changes before starting
- Create a new branch when no clear branch exists for changes
- Commit frequently throughout development
- NEVER skip or disable pre-commit hooks

## Do not

- Skip frontmatter on any MDX file
- Use absolute URLs for internal links
- Include untested code examples
- Make assumptions - always ask for clarification
