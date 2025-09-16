# frozen_string_literal: true

# Paths handled by the React application, which do not:
# - Require indexing
# - Have alternative format representations

%w(
  /blocks
  /bookmarks
  /conversations
  /deck/(*any)
  /directory
  /domain_blocks
  /domain_mutes
  /explore/(*any)
  /favourites
  /follow_requests
  /followed_tags
  /getting-started
  /getting-started-misc
  /home
  /feeds
  /feeds/home
  /feeds/community
  /feeds/global
  /feeds/public
  /feeds/neighbors
  /keyboard-shortcuts
  /links/(*any)
  /lists/(*any)
  /mutes
  /notifications_v2/(*any)
  /notifications/(*any)
  /pinned
  /public
  /public/local
  /public/bubble
  /public/remote
  /publish
  /search
  /start/(*any)
  /statuses/(*any)
).each { |path| get path, to: 'home#index' }
