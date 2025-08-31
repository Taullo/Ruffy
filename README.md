# Ruffy

Fork of [Glitch-soc](https://glitch-soc.github.io/docs/) of [Chuckya](https://github.com/TheEssem/mastodon)

Anyone who uses this is doing so at their own risk! There will be bugs and other possible issues with the code!

Current user features unique from Glitch-soc:

- Blog length posts (100k character limit)
- 20 media uploads (including from other instances)
- 20 poll options
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

## LICENSE

Copyright (c) 2016-2025 Eugen Rochko (+ [`mastodon authors`](AUTHORS.md))

Licensed under GNU Affero General Public License as stated in the [LICENSE](LICENSE):

```text
Copyright (c) 2016-2025 Eugen Rochko & other Mastodon contributors

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see https://www.gnu.org/licenses/
```
