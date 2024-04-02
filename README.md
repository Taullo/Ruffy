# Ruffy

Fork of [Glitch-soc](https://glitch-soc.github.io/docs/)

Anyone who uses this is doing so at their own risk! There will be bugs and other possible issues with the code!

Current user features unique from Glitch-soc:

- Blog length posts (100k character limit)
- 20 media uploads (including from other instances)
- 20 poll options
- Emoji Reactions (https://github.com/glitch-soc/mastodon/pull/2221/)
- GIF Reactions ([adapted from](https://github.com/koyuspace/mastodon))
- Domain muting (https://github.com/glitch-soc/mastodon/pull/2163/)
- Larger profile headers
- Larger filesize limits
- 15 profile fields
- 100 character limit display name
- Mixed poll and media uploads
- Custom logo upload support

New default theme:

- Redesigned layout to allow for better readability and denser content
- Light and Dark theme depending on browser settings
- Options to force a light or dark theme, or even use a new Mixed color scheme
- Custom accent color for servers. Users can even select their own.
- Header-based navigation
- Two column content layout to allow for denser timelines, userpages, etc.
- Redesigned Explore page that merges the timelines and explore features
- Larger compose field in the simple layout
- Wider statuses column
- More prominent explore features (hashtags and suggestions) in timelines
- Emojis that scale on hover
- Dark theme applied to more elements
- Local timeline as the homepage for logged out users

Admin settings features:

- Custom server-wide accent colors
- Exposes setting for "Link previews for posts with Content Warnings"
- Adds an option for marking all outgoing media as sensitive
- Custom wordmark (logo) for both light and dark themes
- Custom icon used for favicon, app icons, etc.

API Changes

- Add toggleable local_only parameter to post options
- Detailed info on post privacy types
- Wordmark (both light and dark), icon, and accent color information
- Detailed fork info

- You can view documentation for Glitch-soc at [glitch-soc.github.io/docs/](https://glitch-soc.github.io/docs/) and the documentation for Mastodon at [docs.joinmastodon.org](https://docs.joinmastodon.org/)

Follow [our fediverse account](https://aethy.com/@Ruffy) for the latest updates!
